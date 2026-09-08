import crypto from 'crypto'
import type { CollectionBeforeChangeHook, CollectionConfig, Field, PayloadRequest } from 'payload'
/** The plugin does not export a named type for this option; mirror its shape. */
type FormSubmissionOverrides = {
  fields?: (args: { defaultFields: Field[] }) => Field[]
} & Partial<Omit<CollectionConfig, 'fields'>>

import { classifySubmission, type Classification } from '@/spam/classify'
import { entriesToFieldMap, extractSpamMeta, stripSpamMetaFields } from '@/spam/fields'

/**
 * Hash the submitter's IP rather than storing it, so visitor IPs never sit in
 * the database in readable form.
 *
 * This is kept for after-the-fact grouping only — "were these six submissions
 * all the same sender?" while reviewing a spam wave. It is deliberately NOT
 * used for rate limiting: at roughly one submission per day across all forms,
 * any cap loose enough to be safe for real users would never trigger, and
 * x-forwarded-for is spoofable anyway.
 */
const hashIp = (ip: string): string =>
  crypto
    .createHash('sha256')
    .update(`${process.env.PAYLOAD_SECRET ?? 'fallback-salt'}:${ip}`)
    .digest('hex')
    .slice(0, 32)

const getClientIp = (req: PayloadRequest): string | undefined => {
  const headers = req.headers
  if (!headers) return undefined

  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }

  return headers.get('x-real-ip') ?? undefined
}

/**
 * Every spam field is readable by logged-in users only.
 *
 * Submissions are created by anonymous visitors, and Payload echoes the newly
 * created document back in the POST response. Without this, a spammer could
 * read `isSpam` — and `spamReason`, which names the exact phrases that matched
 * — straight out of the network response, then reword and resubmit until the
 * flag cleared. Hiding these makes a flagged submission indistinguishable from
 * an accepted one to the sender.
 */
const staffOnly = { read: ({ req }: { req: PayloadRequest }) => Boolean(req.user) }

const spamFields: Field[] = [
  {
    name: 'isSpam',
    access: staffOnly,
    type: 'checkbox',
    defaultValue: false,
    label: 'Spam',
    index: true,
    admin: {
      position: 'sidebar',
      description:
        'Automatically flagged by the spam filter. Flagged submissions are still stored but do not trigger a notification email. Untick this if a real enquiry was caught by mistake.',
    },
  },
  {
    name: 'spamReason',
    access: staffOnly,
    type: 'text',
    label: 'Spam reason',
    admin: {
      position: 'sidebar',
      description: 'Which rules matched. Editable — clear it when un-flagging a submission.',
      condition: (data) => Boolean(data?.isSpam) || Boolean(data?.spamReason),
    },
  },
  {
    name: 'isInternalTest',
    access: staffOnly,
    type: 'checkbox',
    defaultValue: false,
    label: 'Internal test',
    index: true,
    admin: {
      position: 'sidebar',
      description:
        'One of our own QA submissions. Filter these out when reporting on real enquiries. Notifications for these go only to the developer, never to the attorney.',
    },
  },
  {
    name: 'spamScore',
    access: staffOnly,
    type: 'number',
    label: 'Spam score',
    admin: {
      position: 'sidebar',
      readOnly: true,
      description: 'Higher means more spam signals matched. 10 or above is flagged.',
      condition: (data) => typeof data?.spamScore === 'number',
    },
  },
  {
    name: 'emailSent',
    type: 'checkbox',
    access: staffOnly,
    defaultValue: false,
    label: 'Notification email sent',
    index: true,
    admin: {
      position: 'sidebar',
      readOnly: true,
      description: 'Ticked once the notification email is actually accepted by the mail server.',
    },
  },
  {
    name: 'emailStatus',
    type: 'select',
    access: staffOnly,
    defaultValue: 'pending',
    label: 'Notification status',
    index: true,
    options: [
      // A submission stuck on "pending" never reached the email route at all —
      // the visitor closed the tab mid-request, or the network dropped. Filter
      // on this to find enquiries nobody was told about.
      { label: 'Pending', value: 'pending' },
      { label: 'Sent', value: 'sent' },
      { label: 'Failed', value: 'failed' },
      { label: 'Suppressed (spam)', value: 'suppressed' },
    ],
    admin: {
      position: 'sidebar',
      readOnly: true,
      description:
        'Pending = the email was never attempted. Failed = the mail server rejected it; see the error below.',
    },
  },
  {
    name: 'emailError',
    type: 'text',
    access: staffOnly,
    label: 'Notification error',
    admin: {
      position: 'sidebar',
      readOnly: true,
      condition: (data) => Boolean(data?.emailError),
    },
  },
  {
    name: 'emailSentAt',
    type: 'date',
    access: staffOnly,
    label: 'Notification sent at',
    admin: {
      position: 'sidebar',
      readOnly: true,
      condition: (data) => Boolean(data?.emailSentAt),
    },
  },
  {
    name: 'autoReplySent',
    type: 'checkbox',
    access: staffOnly,
    defaultValue: false,
    label: 'Auto-reply sent to submitter',
    admin: {
      position: 'sidebar',
      readOnly: true,
    },
  },
  {
    name: 'ipHash',
    access: staffOnly,
    type: 'text',
    index: true,
    admin: {
      hidden: true,
    },
  },
]

/**
 * Classify on create. This lives on the collection rather than in the API
 * routes so that a bot POSTing straight to `/api/form-submissions` — skipping
 * our client entirely — is still classified.
 */
const classifyOnCreate: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  // Only classify fresh submissions. An admin editing the record by hand must
  // be able to un-flag it without the filter immediately flagging it again.
  if (operation !== 'create') return data

  const submissionData = Array.isArray(data.submissionData) ? data.submissionData : []

  let honeypot: string | undefined
  let elapsedMs: number | undefined

  try {
    ;({ honeypot, elapsedMs } = extractSpamMeta(submissionData))
  } catch {
    // Malformed submissionData must not stop the enquiry being stored.
  }

  const ip = getClientIp(req)
  const ipHash = ip ? hashIp(ip) : undefined

  // Fail open. Storing the submission matters more than classifying it: a
  // missed injured worker is a lost case, while an unflagged spam message is
  // merely an unwanted email. src/spam/rules.ts is meant to be edited by
  // non-developers, so a bad entry there must never be able to stop the site
  // accepting enquiries.
  let result: Classification

  try {
    result = classifySubmission({
      fields: entriesToFieldMap(submissionData),
      honeypot,
      elapsedMs,
    })
  } catch (err) {
    req.payload.logger.error(
      { err },
      '[spam] classifier threw — storing submission unflagged. Check src/spam/rules.ts.',
    )
    result = {
      isSpam: false,
      isInternalTest: false,
      score: 0,
      reasons: [],
      spamReason: '',
    }
  }

  if (result.isSpam) {
    req.payload.logger.info(
      { reasons: result.reasons, score: result.score },
      '[spam] submission flagged',
    )
  }

  return {
    ...data,
    // Drop the guard's own fields so the client never sees them and the stored
    // shape of submissionData matches every existing record.
    submissionData: stripSpamMetaFields(submissionData),
    isSpam: result.isSpam,
    isInternalTest: result.isInternalTest,
    spamReason: result.spamReason,
    spamScore: result.score,
    // Real spam is never emailed, so record that outcome now. Everything else
    // starts as pending and is updated by the email route once it has actually
    // tried to send — anything still pending afterwards means nobody was told.
    emailStatus: result.isSpam && !result.isInternalTest ? 'suppressed' : 'pending',
    emailSent: false,
    ipHash,
  }
}

/**
 * Opening `update` access on the collection is what lets the client correct a
 * mis-flagged submission. This keeps what was actually submitted immutable, so
 * only the spam fields can be edited and the record stays a faithful audit
 * trail of what the visitor sent.
 */
const lockSubmittedData = (field: Field): Field => {
  if ('name' in field && (field.name === 'submissionData' || field.name === 'form')) {
    return {
      ...field,
      access: { ...('access' in field ? field.access : {}), update: () => false },
    } as Field
  }
  return field
}

export const formSubmissionOverrides: FormSubmissionOverrides = {
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    // The plugin default is `() => false`, which would make the spam flag
    // impossible to correct. Field-level access below keeps the submitted
    // data itself immutable.
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    defaultColumns: ['form', 'isSpam', 'emailStatus', 'isInternalTest', 'createdAt'],
    listSearchableFields: ['spamReason'],
  },
  fields: ({ defaultFields }: { defaultFields: Field[] }) => [
    ...defaultFields.map(lockSubmittedData),
    ...spamFields,
  ],
  hooks: {
    beforeChange: [classifyOnCreate],
  },
}
