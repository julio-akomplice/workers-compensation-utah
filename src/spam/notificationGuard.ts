import configPromise from '@payload-config'
import { getPayload } from 'payload'

export type NotificationDecision = {
  /** True when no notification email should be sent at all. */
  suppress: boolean
  /**
   * True for our own QA submissions: still email, but only to the developer
   * recipients — never the attorney and never the agency BCC.
   */
  internalOnly: boolean
  reason: string
}

/**
 * Decides whether a notification email may be sent, using the stored
 * submission as the only source of truth.
 *
 * Both email routes are public and unauthenticated, and previously accepted a
 * fully client-supplied body with an OPTIONAL submission id. That meant anyone
 * could POST arbitrary content to `/api/send-form-email` and have it mailed to
 * the firm — and have a branded auto-reply sent to any address they chose —
 * without ever creating a record. Requiring the id and reading the flag off
 * the saved document closes that: the only way to trigger an email is to first
 * create a submission, which is classified by the collection's beforeChange
 * hook.
 *
 * Fails closed. If the id is missing or does not resolve to a real submission,
 * no email is sent.
 */
export async function shouldSuppressNotification(
  submissionId: string | undefined,
): Promise<NotificationDecision> {
  if (!submissionId) {
    return { suppress: true, internalOnly: false, reason: 'missing-submission-id' }
  }

  try {
    const payload = await getPayload({ config: configPromise })

    const doc = await payload.findByID({
      collection: 'form-submissions',
      id: submissionId,
      depth: 0,
      overrideAccess: true,
    })

    if (!doc) {
      return { suppress: true, internalOnly: false, reason: 'submission-not-found' }
    }

    const submission = doc as { isSpam?: boolean; isInternalTest?: boolean; spamReason?: string }

    // Our own QA submissions still send, but only to the developer. This keeps
    // the email pipeline testable end to end without ever reaching the client.
    if (submission.isInternalTest) {
      return { suppress: false, internalOnly: true, reason: 'internal-test' }
    }

    if (submission.isSpam) {
      return {
        suppress: true,
        internalOnly: false,
        reason: submission.spamReason || 'flagged-as-spam',
      }
    }

    return { suppress: false, internalOnly: false, reason: '' }
  } catch {
    // An unknown id throws rather than returning null.
    return { suppress: true, internalOnly: false, reason: 'submission-not-found' }
  }
}

export type NotificationOutcome = {
  status: 'sent' | 'failed' | 'suppressed'
  error?: string
  autoReplySent?: boolean
}

/**
 * Record what actually happened to the notification email on the submission
 * itself, so a silent mail failure is visible in the admin instead of being
 * lost to the server logs.
 *
 * Never throws: a bookkeeping failure must not turn a delivered email into a
 * failed request.
 */
export async function recordNotificationOutcome(
  submissionId: string | undefined,
  outcome: NotificationOutcome,
): Promise<void> {
  if (!submissionId) return

  try {
    const payload = await getPayload({ config: configPromise })

    await payload.update({
      collection: 'form-submissions',
      id: submissionId,
      overrideAccess: true,
      data: {
        emailStatus: outcome.status,
        emailSent: outcome.status === 'sent',
        emailSentAt: outcome.status === 'sent' ? new Date().toISOString() : undefined,
        // Truncated: this is a human-readable hint, not a full stack trace.
        emailError: outcome.error ? outcome.error.slice(0, 500) : undefined,
        autoReplySent: outcome.autoReplySent ?? false,
      },
    })
  } catch (err) {
    console.error('[notification] failed to record delivery outcome:', err)
  }
}

/** Escape user-supplied text before interpolating it into an email body. */
export const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
