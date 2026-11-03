import type { CollectionAfterChangeHook, Payload } from 'payload'
import type { Transporter } from 'nodemailer'

import { formBcc, formRecipients, internalTestRecipients } from '@/constants/formRecipients'
import { sendAutoReply } from '@/emails/autoReplyEmail'
import { stripSpamMetaFields } from '@/spam/fields'
import type { NotificationOutcome } from '@/spam/notificationGuard'
import { escapeHtml } from '@/utilities/escapeHtml'
import { createEmailTransport } from '@/utilities/emailTransport'

import { questionnaireLabelMap, valueDisplayMap } from './caseQuestionnaireLabels'

/**
 * The attorney's notification email, sent by the SERVER when a submission is saved.
 *
 * Until 2026-11-03 the visitor's browser made two calls: one to save the
 * submission (/api/form-submissions) and a second to /api/send-form-email (or
 * /api/send-case-questionnaire) to email the attorney. Anyone could save a
 * submission and simply not make the second call, a visitor who closed the tab
 * in between was never emailed about, and the email text came from the request
 * body rather than the saved record. Sending from this afterChange hook fixes
 * all three: every saved, non-spam submission is emailed, and the email is
 * built only from what was stored.
 *
 * Rules:
 * - Create only. Admin edits and the outcome write-back below are updates.
 * - Spam is never emailed (classifyOnCreate already marked it "suppressed").
 *   Internal tests are emailed to the developer only, never the attorney.
 * - Never hold up or fail the submission. Payload waits for afterChange hooks
 *   before answering the browser, so the send is started and NOT awaited, and
 *   every error is caught. The outcome (sent / failed) is written back onto the
 *   submission so a mail outage is visible in the admin.
 */

export type Entry = { field: string; value: unknown }

export type SubmissionForEmail = {
  id: string
  submissionData?: Entry[] | null
  isSpam?: boolean | null
  isInternalTest?: boolean | null
}

export type FormForEmail = {
  title?: string | null
  fields?: Array<{ name?: string | null; label?: string | null }> | null
} | null

export type NotificationEmail = {
  subject: string
  html: string
  submitterName: string
  submitterEmail: string
}

const toFieldMap = (entries: Entry[] | null | undefined): Record<string, string> => {
  const map: Record<string, string> = {}
  for (const entry of stripSpamMetaFields((entries ?? []).filter((e) => typeof e?.field === 'string'))) {
    map[entry.field] = typeof entry.value === 'string' ? entry.value : String(entry.value ?? '')
  }
  return map
}

const safeHref = (url: string): string | undefined => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : undefined
  } catch {
    return undefined
  }
}

const nameFrom = (fields: Record<string, string>): string => {
  const first = fields.firstName?.trim()
  const last = fields.lastName?.trim()
  if (first || last) return [first, last].filter(Boolean).join(' ')
  const key = ['full-name', 'fullName', 'name', 'your-name', 'full_name', 'First Name'].find((k) =>
    fields[k]?.trim(),
  )
  return key ? fields[key].trim() : 'Visitor'
}

export const isQuestionnaire = (form: FormForEmail, fields: Record<string, string>): boolean =>
  /questionnaire/i.test(form?.title ?? '') || 'howInjuryOccurred' in fields

const row = (label: string, value: string, muted = false, width = 140) => `
          <tr>
            <td style="padding:10px 16px;font-weight:600;color:#374151;background:#f9fafb;width:${width}px;border-bottom:1px solid #e5e7eb;">${escapeHtml(label)}</td>
            <td style="padding:10px 16px;color:${muted ? '#9ca3af' : '#111827'};border-bottom:1px solid #e5e7eb;">${escapeHtml(value)}</td>
          </tr>`

const frame = (title: string, intro: string, rows: string, footer: string, width: number) => `
      <div style="font-family:sans-serif;max-width:${width}px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div style="background:#1e3a5f;padding:24px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;">${title}</h1>
          <p style="margin:4px 0 0;color:#93c5fd;font-size:14px;">Workers Compensation Utah</p>
        </div>
        <div style="padding:24px 32px;">
          <p style="margin:0;color:#374151;font-size:15px;">${intro}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb;">
          ${rows}
        </table>
        <div style="padding:16px 32px;background:#f9fafb;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">${footer}</p>
        </div>
      </div>`

const fromLine = (name: string, email: string) =>
  `<strong>${escapeHtml(name)}</strong>${
    email
      ? ` (<a href="mailto:${escapeHtml(email)}" style="color:#1e3a5f;">${escapeHtml(email)}</a>)`
      : ''
  }`

/** Build the attorney email from the STORED submission. Pure, so it is unit tested. */
export function buildNotificationEmail(
  submission: SubmissionForEmail,
  form: FormForEmail,
  internalOnly: boolean,
): NotificationEmail {
  const fields = toFieldMap(submission.submissionData)
  const submitterEmail = fields.email?.trim() ?? ''
  const submitterName = nameFrom(fields)
  const id = escapeHtml(submission.id)
  const testPrefix = internalOnly ? '[INTERNAL TEST] ' : ''

  if (isQuestionnaire(form, fields)) {
    const rows = Object.entries(questionnaireLabelMap)
      .map(([field, label]) => {
        const raw = fields[field]?.trim() ?? ''
        if (!raw) return row(label, '—', true, 180)
        const map = valueDisplayMap[field]
        // Multi-choice answers are stored joined with ", " by the questionnaire form.
        const display = map ? raw.split(', ').map((v) => map[v] ?? v).join(', ') : raw
        return row(label, display, false, 180)
      })
      .join('')
    return {
      subject: `${testPrefix}Case Questionnaire [#${submission.id}]`,
      html: frame(
        'New Case Questionnaire',
        `You have received a new case questionnaire from ${fromLine(submitterName, submitterEmail)}.
            <br/><span style="color:#9ca3af;font-size:13px;">Submission ID: #${id}</span>`,
        rows,
        'This email was sent automatically from the case questionnaire form.',
        640,
      ),
      submitterName,
      submitterEmail,
    }
  }

  const labels: Record<string, string> = {}
  for (const f of form?.fields ?? []) {
    if (f?.name) labels[f.name] = f.label || f.name
  }
  const formName = form?.title?.trim() || ''
  const sourceUrl = fields.sourceUrl ? safeHref(fields.sourceUrl) : undefined
  const rows = Object.entries(fields)
    .filter(([field]) => field !== 'sourceUrl')
    .map(([field, value]) => row(labels[field] ?? field, value))
    .join('')

  return {
    subject: `${testPrefix}New inquiry${formName ? ` — ${formName}` : ''} [#${submission.id}]`,
    html: frame(
      'New Form Submission',
      `You have received a new submission from ${fromLine(submitterName, submitterEmail)}.
            ${formName ? `<br/><span style="color:#9ca3af;font-size:13px;">Form: ${escapeHtml(formName)}</span>` : ''}
            <br/><span style="color:#9ca3af;font-size:13px;">Record ID: ${id}</span>
            ${sourceUrl ? `<br/><span style="color:#9ca3af;font-size:13px;">Submitted from: <a href="${escapeHtml(sourceUrl)}" style="color:#9ca3af;text-decoration:none;cursor:auto;">${escapeHtml(sourceUrl)}</a></span>` : ''}`,
      rows,
      'This email was sent automatically from your website contact form.',
      600,
    ),
    submitterName,
    submitterEmail,
  }
}

type Logger = { info: (...a: unknown[]) => void; error: (...a: unknown[]) => void }

export type NotifyDeps = {
  createTransport: () => Pick<Transporter, 'sendMail'>
  sendAutoReply: typeof sendAutoReply
  /** Wait before retrying the outcome write; the create may not be committed yet. */
  retryDelayMs: number
}

const defaultDeps: NotifyDeps = {
  createTransport: createEmailTransport,
  sendAutoReply,
  retryDelayMs: 2000,
}

/** Write the outcome onto the submission. One retry; never throws. */
async function recordOutcome(
  payload: Pick<Payload, 'update'>,
  id: string,
  outcome: NotificationOutcome,
  logger: Logger,
  retryDelayMs: number,
): Promise<void> {
  const data = {
    emailStatus: outcome.status,
    emailSent: outcome.status === 'sent',
    emailSentAt: outcome.status === 'sent' ? new Date().toISOString() : undefined,
    emailError: outcome.error ? outcome.error.slice(0, 500) : undefined,
    autoReplySent: outcome.autoReplySent ?? false,
  }
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await payload.update({ collection: 'form-submissions', id, overrideAccess: true, data })
      return
    } catch (err) {
      if (attempt === 2) {
        logger.error({ err, submissionId: id }, '[notification] could not record the email outcome')
        return
      }
      await new Promise((r) => setTimeout(r, retryDelayMs))
    }
  }
}

/** Send the attorney email (and the auto-reply) for one stored submission. Never throws. */
export async function sendSubmissionNotification(
  submission: SubmissionForEmail,
  payload: Pick<Payload, 'update' | 'findByID'>,
  logger: Logger,
  deps: NotifyDeps = defaultDeps,
): Promise<NotificationOutcome | null> {
  const internalOnly = Boolean(submission.isInternalTest)
  // Real spam: classifyOnCreate already stored emailStatus "suppressed".
  if (submission.isSpam && !internalOnly) return null

  let outcome: NotificationOutcome
  try {
    const formId = (submission as { form?: unknown }).form
    let form: FormForEmail = null
    const id = typeof formId === 'string' ? formId : (formId as { id?: string } | undefined)?.id
    if (typeof formId === 'object' && formId && 'title' in formId) {
      form = formId as FormForEmail
    } else if (id) {
      form = (await payload
        .findByID({ collection: 'forms', id, depth: 0, overrideAccess: true })
        .catch(() => null)) as FormForEmail
    }

    const email = buildNotificationEmail(submission, form, internalOnly)
    const transport = deps.createTransport()
    await transport.sendMail({
      to: internalOnly ? internalTestRecipients : formRecipients,
      bcc: !internalOnly && formBcc.length > 0 ? formBcc : undefined,
      from: `"Workers Compensation Utah" <${process.env.EMAIL_FROM_ADDRESS}>`,
      replyTo: email.submitterEmail
        ? `"${email.submitterName.replace(/"/g, '')}" <${email.submitterEmail}>`
        : undefined,
      subject: email.subject,
      html: email.html,
    })
    // On an internal test the confirmation goes to us, never to the address in
    // the form, which may belong to someone unrelated.
    const autoReplySent = await deps.sendAutoReply(
      transport as Transporter,
      email.submitterEmail || undefined,
      email.submitterName,
      internalOnly ? internalTestRecipients[0] : undefined,
    )
    if (internalOnly) logger.info({ submissionId: submission.id }, '[notification] internal test, sent to developer only')
    outcome = { status: 'sent', autoReplySent }
  } catch (err) {
    logger.error({ err, submissionId: submission.id }, '[notification] send failed')
    outcome = { status: 'failed', error: err instanceof Error ? err.message : String(err) }
  }

  await recordOutcome(payload, submission.id, outcome, logger, deps.retryDelayMs)
  return outcome
}

/** afterChange hook on form-submissions. See the header comment. */
export const notifyOnCreate: CollectionAfterChangeHook = ({ doc, operation, req }) => {
  try {
    if (operation !== 'create') return doc
    const submission = { ...doc, id: String(doc.id) } as SubmissionForEmail
    if (submission.isSpam && !submission.isInternalTest) return doc
    // Not awaited on purpose: see the header comment.
    void sendSubmissionNotification(submission, req.payload, req.payload.logger)
  } catch (err) {
    req.payload.logger.error({ err }, '[notification] could not queue the email')
  }
  return doc
}
