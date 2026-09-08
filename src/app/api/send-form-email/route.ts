import { NextRequest, NextResponse } from 'next/server'
import { createEmailTransport } from '@/utilities/emailTransport'
import { sendFormEmailSchema } from '@/utilities/buildFormSchema'
import { formRecipients, formBcc, internalTestRecipients } from '@/constants/formRecipients'
import { sendAutoReply } from '@/emails/autoReplyEmail'
import { escapeHtml, recordNotificationOutcome, shouldSuppressNotification } from '@/spam/notificationGuard'
import { stripSpamMetaFields } from '@/spam/fields'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = sendFormEmailSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { submissionData, labelMap = {}, submissionId, sourceUrl, formName } = parsed.data

    // Authority on whether to send is the stored submission, never the request
    // body. Suppressed submissions are already saved and reviewable in the
    // admin — nothing is dropped, only the notification is withheld.
    const { suppress, internalOnly, reason } = await shouldSuppressNotification(submissionId)

    if (suppress) {
      console.info(`[send-form-email] notification suppressed (${reason})`)
      await recordNotificationOutcome(submissionId, { status: 'suppressed' })
      // Deliberately indistinguishable from success so a bot learns nothing.
      return NextResponse.json({ success: true })
    }

    const rows = stripSpamMetaFields(submissionData)
      .filter(({ field }) => field !== 'sourceUrl')
      .map(({ field, value }) => {
        const label = escapeHtml(labelMap[field] ?? field)
        return `
          <tr>
            <td style="padding:10px 16px;font-weight:600;color:#374151;background:#f9fafb;width:140px;border-bottom:1px solid #e5e7eb;">${label}</td>
            <td style="padding:10px 16px;color:#111827;border-bottom:1px solid #e5e7eb;">${escapeHtml(value)}</td>
          </tr>`
      })
      .join('')

    const submitterEmail = submissionData.find((d) => d.field === 'email')?.value ?? ''
    const submitterName = (() => {
      // Try split first/last name fields
      const first = submissionData.find((d) => d.field === 'firstName')?.value
      const last = submissionData.find((d) => d.field === 'lastName')?.value
      if (first || last) return [first, last].filter(Boolean).join(' ')
      // Fall back to common single-name field names
      const full = submissionData.find((d) =>
        ['full-name', 'fullName', 'name', 'your-name', 'full_name'].includes(d.field),
      )?.value
      return full || 'Visitor'
    })()

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div style="background:#1e3a5f;padding:24px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;">New Form Submission</h1>
          <p style="margin:4px 0 0;color:#93c5fd;font-size:14px;">Workers Compensation Utah</p>
        </div>
        <div style="padding:24px 32px;">
          <p style="margin:0;color:#374151;font-size:15px;">
            You have received a new submission from <strong>${escapeHtml(submitterName)}</strong>${submitterEmail ? ` (<a href="mailto:${escapeHtml(submitterEmail)}" style="color:#1e3a5f;">${escapeHtml(submitterEmail)}</a>)` : ''}.
            ${formName ? `<br/><span style="color:#9ca3af;font-size:13px;">Form: ${escapeHtml(formName)}</span>` : ''}
            ${submissionId ? `<br/><span style="color:#9ca3af;font-size:13px;">Record ID: ${escapeHtml(submissionId)}</span>` : ''}
            ${sourceUrl ? `<br/><span style="color:#9ca3af;font-size:13px;">Submitted from: <a href="${escapeHtml(sourceUrl)}" style="color:#9ca3af;text-decoration:none;cursor:auto;">${escapeHtml(sourceUrl)}</a></span>` : ''}
          </p>
        </div>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb;">
          ${rows}
        </table>
        <div style="padding:16px 32px;background:#f9fafb;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">This email was sent automatically from your website contact form.</p>
        </div>
      </div>`

    if (internalOnly) {
      console.info('[send-form-email] internal test — routing to developer only')
    }

    const recipients = internalOnly ? internalTestRecipients : formRecipients
    const bcc = internalOnly ? [] : formBcc

    const transport = createEmailTransport()

    try {
      await transport.sendMail({
        to: recipients,
        bcc: bcc.length > 0 ? bcc : undefined,
        from: `"Workers Compensation Utah" <${process.env.EMAIL_FROM_ADDRESS}>`,
        replyTo: submitterEmail ? `"${submitterName}" <${submitterEmail}>` : undefined,
        subject: `${internalOnly ? '[INTERNAL TEST] ' : ''}New inquiry${formName ? ` — ${formName}` : ''}${submissionId ? ` [#${submissionId}]` : ''}`,
        html,
      })

      // Automated confirmation reply to the submitter (only if they left an email).
      // Never blocks or fails the primary submission — sendAutoReply swallows errors.
      // On an internal test the confirmation is redirected to us, never to the
      // address in the form — that address may belong to someone unrelated.
      const autoReplySent = await sendAutoReply(
        transport,
        submitterEmail || undefined,
        submitterName,
        internalOnly ? internalTestRecipients[0] : undefined,
      )

      await recordNotificationOutcome(submissionId, { status: 'sent', autoReplySent })
    } catch (mailErr) {
      // The submission is already saved; record the failure on it so a silent
      // mail outage shows up in the admin rather than only in the server logs.
      console.error('[send-form-email] send failed:', mailErr)
      await recordNotificationOutcome(submissionId, {
        status: 'failed',
        error: mailErr instanceof Error ? mailErr.message : String(mailErr),
      })
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[send-form-email] error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
