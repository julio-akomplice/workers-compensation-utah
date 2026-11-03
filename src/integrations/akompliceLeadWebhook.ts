import type { CollectionAfterChangeHook } from 'payload'

/**
 * Forward each new form submission to the Akomplice dashboard as a lead.
 *
 * Akomplice gives every client a secret webhook URL
 * (`https://app-api.akomplice.ai/api/v2/webhooks/forms/<token>`). The token in
 * the path decides which client the lead belongs to, so the URL is a secret: it
 * lives only in the AKOMPLICE_FORMS_WEBHOOK_URL environment variable and is
 * never logged. With the variable unset (local dev, staging) nothing is sent.
 *
 * Rules, in order of importance:
 * - Never hold up or fail the visitor's submission. Payload waits for
 *   afterChange hooks before it answers the browser, so the POST is started and
 *   NOT awaited, and every error is caught and logged.
 * - Create only. The email routes update the same record afterwards
 *   (notificationGuard), and staff edit it in the admin; without this guard one
 *   lead would be sent two or three times.
 * - Spam and internal QA submissions stay on the site. `isSpam` is already set
 *   by classifyOnCreate (beforeChange) and also covers internal tests.
 * - Safe to retry: the submission id goes along as `submission_id`, and
 *   Akomplice ignores a second POST with the same id.
 */

export const WEBHOOK_URL_ENV = 'AKOMPLICE_FORMS_WEBHOOK_URL'

const TIMEOUT_MS = 8000
const RETRY_DELAY_MS = 3000

/** The four production forms (GET /api/forms). Unknown ids are sent as-is. */
export const FORM_TITLES: Record<string, string> = {
  '6a3ec245700748e46193234d': 'Landing Page',
  '69d6a67a43f3a285c4a374ee': 'Short Side Form',
  '69d686dc43f3a285c4a326e2': 'Contact',
  '69d6a75943f3a285c4a37963': 'Case Questionnaire',
}

const ATTRIBUTION_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'msclkid',
] as const

type Entry = { field?: unknown; value?: unknown }

export type SubmissionDoc = {
  id: string
  createdAt?: string
  form?: string | { id?: string; title?: string } | null
  submissionData?: Entry[] | null
  isSpam?: boolean | null
  isInternalTest?: boolean | null
}

/** Flatten submissionData into { field: value } with string values. */
const toFieldMap = (entries: Entry[] | null | undefined): Record<string, string> => {
  const map: Record<string, string> = {}
  for (const entry of entries ?? []) {
    if (typeof entry?.field !== 'string' || !entry.field) continue
    map[entry.field] = typeof entry.value === 'string' ? entry.value : String(entry.value ?? '')
  }
  return map
}

/** Case- and separator-insensitive lookup: "First Name", "firstName", "first_name". */
const pick = (fields: Record<string, string>, ...names: string[]): string | undefined => {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
  const wanted = names.map(norm)
  for (const [key, value] of Object.entries(fields)) {
    if (wanted.includes(norm(key)) && value.trim()) return value.trim()
  }
  return undefined
}

/** utm_* and click ids from the page URL the form was sent from. */
const attributionFrom = (pageUrl: string | undefined): Record<string, string> => {
  if (!pageUrl) return {}
  try {
    const params = new URL(pageUrl).searchParams
    const found: Record<string, string> = {}
    for (const key of ATTRIBUTION_PARAMS) {
      const value = params.get(key)
      if (value) found[key] = value
    }
    return found
  } catch {
    return {}
  }
}

/**
 * The JSON body Akomplice receives. Top-level keys use the names its lead
 * mapper recognises (name, email, phone, message, submission_id, submitted_at,
 * utm_source); every original field is kept under `fields`.
 */
export const buildLeadPayload = (doc: SubmissionDoc): Record<string, unknown> => {
  const fields = toFieldMap(doc.submissionData)
  const formId = typeof doc.form === 'string' ? doc.form : doc.form?.id
  const formTitle =
    (typeof doc.form === 'object' && doc.form?.title) ||
    (formId ? FORM_TITLES[formId] : undefined) ||
    formId

  const first = pick(fields, 'firstName')
  const last = pick(fields, 'lastName')
  const name = pick(fields, 'name', 'fullName') ?? ([first, last].filter(Boolean).join(' ') || undefined)
  const pageUrl = pick(fields, 'sourceUrl')

  const payload: Record<string, unknown> = {
    submission_id: doc.id,
    submitted_at: doc.createdAt,
    form: formTitle,
    form_id: formId,
    name,
    email: pick(fields, 'email'),
    phone: pick(fields, 'phone', 'phoneNumber'),
    message: pick(fields, 'message', 'howInjuryOccurred'),
    page_url: pageUrl,
    ...attributionFrom(pageUrl),
    fields,
  }
  // Leave out empty keys so the lead never shows "undefined".
  return Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined && v !== ''))
}

/** The webhook URL without its secret token, for log lines. */
export const redactWebhookUrl = (url: string): string => url.replace(/\/forms\/[^/?#]+/, '/forms/<token>')

type Logger = { info: (...a: unknown[]) => void; warn: (...a: unknown[]) => void; error: (...a: unknown[]) => void }

const post = (url: string, body: string) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })

/**
 * Send one payload, retrying once on a network error or a 5xx. A 4xx is not
 * retried: 404 means the token is wrong or revoked, which a retry won't fix.
 * Never throws.
 */
export const sendLead = async (
  url: string,
  payload: Record<string, unknown>,
  logger: Logger,
  retryDelayMs = RETRY_DELAY_MS,
): Promise<boolean> => {
  const body = JSON.stringify(payload)
  const where = redactWebhookUrl(url)
  const id = payload.submission_id

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await post(url, body)
      if (res.ok) {
        logger.info({ submissionId: id, status: res.status }, '[akomplice] lead sent')
        return true
      }
      if (res.status < 500) {
        logger.error({ submissionId: id, status: res.status, url: where }, '[akomplice] lead rejected')
        return false
      }
      logger.warn({ submissionId: id, status: res.status, attempt }, '[akomplice] lead send failed')
    } catch (err) {
      logger.warn(
        { submissionId: id, attempt, error: err instanceof Error ? err.message : String(err) },
        '[akomplice] lead send failed',
      )
    }
    if (attempt === 1) await new Promise((r) => setTimeout(r, retryDelayMs))
  }
  logger.error({ submissionId: id, url: where }, '[akomplice] lead NOT sent after retry')
  return false
}

export const forwardToAkomplice: CollectionAfterChangeHook = ({ doc, operation, req }) => {
  try {
    if (operation !== 'create') return doc
    const url = process.env[WEBHOOK_URL_ENV]?.trim()
    if (!url) return doc
    const submission = doc as SubmissionDoc
    if (submission.isSpam) return doc

    // Not awaited on purpose: see the header comment.
    void sendLead(url, buildLeadPayload(submission), req.payload.logger)
  } catch (err) {
    req.payload.logger.error({ err }, '[akomplice] could not queue lead')
  }
  return doc
}
