import type { Transporter } from 'nodemailer'
import { wcuLogoBase64 } from './wcuLogo'

const LOGO_CID = 'wcu-logo'

// Sender / reply address. Per client instruction the auto-reply is sent from and
// replied to attorney@kingburkelaw.com (the Brevo-verified sender). EMAIL_FROM_ADDRESS
// is that same verified address, so we reuse it and fall back to the literal.
const REPLY_TO = process.env.EMAIL_FROM_ADDRESS || 'attorney@kingburkelaw.com'

// In production the auto-reply goes to the actual submitter. In development it is
// redirected to a test inbox so we never email real submitters while testing.
const DEV_REPLY_RECIPIENT = 'julio@akomplice.ai'

const tips: { title: string; body: string }[] = [
  {
    title: 'Report the injury to your employer in writing',
    body: 'If you have not already done so. A written report, even a text message or email, creates a record that the injury was reported.',
  },
  {
    title: 'Seek medical attention',
    body: 'And make sure the treating physician knows the injury happened at work. This documentation is critical to your claim.',
  },
  {
    title: 'Do not give a recorded statement to the insurance company',
    body: 'Before speaking with an attorney. What you say early in the process can significantly affect the value of your claim.',
  },
  {
    title: 'Document everything',
    body: 'Photographs of the accident scene, your injuries, and any equipment involved. Keep copies of all medical records and correspondence.',
  },
]

/**
 * Builds the HTML for the automated confirmation reply sent to a form submitter.
 * Content matches the client-approved copy. The WCU colored logo is referenced by
 * CID (`cid:wcu-logo`) and must be provided as an attachment when sending.
 */
export function buildAutoReplyHtml(submitterName?: string): string {
  const greetingName = submitterName && submitterName !== 'Visitor' ? submitterName : ''

  const tipRows = tips
    .map(
      (t) => `
        <tr>
          <td style="padding:0 0 16px;color:#374151;font-size:15px;line-height:1.55;">
            <span style="color:#ea580c;font-weight:700;">•</span>
            <strong style="color:#111827;">&nbsp;${t.title}</strong> — ${t.body}
          </td>
        </tr>`,
    )
    .join('')

  return `
  <div style="background:#f3f4f6;padding:24px 12px;">
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <!-- Logo band -->
      <div style="background:#1e3a5f;padding:28px 32px;text-align:center;">
        <img src="cid:${LOGO_CID}" alt="Workers Compensation Utah" width="220" style="display:inline-block;width:220px;max-width:70%;height:auto;border:0;" />
      </div>

      <!-- Body -->
      <div style="padding:32px;">
        <p style="margin:0 0 16px;color:#111827;font-size:16px;line-height:1.55;">
          ${greetingName ? `Dear ${greetingName},` : 'Hello,'}
        </p>
        <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.55;">
          Thank you for reaching out to Workers Compensation Utah. We have received your
          message and our team is reviewing the details you provided. Someone from our
          office will be in touch with you shortly.
        </p>
        <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.55;">
          In the meantime, here are a few things that may help protect your claim:
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 8px;">
          ${tipRows}
        </table>

        <p style="margin:8px 0 24px;color:#374151;font-size:15px;line-height:1.55;">
          If you would like to speak with us directly, call
          <a href="tel:+18014249675" style="color:#1e3a5f;font-weight:600;text-decoration:none;">801-424-WORK (9675)</a>.
          We are here to help.
        </p>

        <div style="border-top:1px solid #e5e7eb;padding-top:20px;">
          <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">
            Workers Compensation Utah has represented injured Utah workers and their
            families for over 30 years. Richard Burke is the only plaintiff's workers'
            compensation attorney in Utah selected as a member of the College of Workers'
            Compensation Lawyers. We handle workers' compensation claims and personal
            injury cases on a contingency basis — you pay nothing unless we recover for you.
          </p>
          <p style="margin:0;color:#374151;font-size:15px;line-height:1.55;">
            We look forward to speaking with you.
          </p>
        </div>

        <!-- Signature -->
        <div style="margin-top:24px;">
          <p style="margin:0 0 2px;color:#111827;font-size:15px;font-weight:700;">Workers Compensation Utah</p>
          <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
            2046 E. Murray Holladay Rd, Suite 108<br/>
            Holladay, UT 84117<br/>
            Phone: <a href="tel:+18014249675" style="color:#6b7280;text-decoration:none;">801-424-WORK (9675)</a><br/>
            Web: <a href="https://workerscompensationutah.com" style="color:#1e3a5f;text-decoration:none;">workerscompensationutah.com</a>
          </p>
        </div>
      </div>

      <!-- Disclaimer -->
      <div style="padding:18px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
        <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.55;">
          This is an automated confirmation that your message was received. It does not
          constitute legal advice or establish an attorney-client relationship. Please do
          not include sensitive personal information such as Social Security numbers or
          financial account details in email correspondence.
        </p>
      </div>
    </div>
  </div>`
}

/**
 * Sends the automated confirmation reply to a form submitter. No-ops (returns false)
 * when no submitter email is present. Never throws — email delivery failures are logged
 * and swallowed so they cannot break the primary form-submission flow.
 */
export async function sendAutoReply(
  transport: Transporter,
  submitterEmail: string | undefined,
  submitterName?: string,
): Promise<boolean> {
  if (!submitterEmail) return false

  // Only email real submitters in production; redirect to the test inbox otherwise.
  const recipient =
    process.env.NODE_ENV === 'production' ? submitterEmail : DEV_REPLY_RECIPIENT

  try {
    await transport.sendMail({
      to: submitterName ? `"${submitterName}" <${recipient}>` : recipient,
      from: `"Workers Compensation Utah" <${process.env.EMAIL_FROM_ADDRESS}>`,
      replyTo: REPLY_TO,
      subject: 'We Received Your Message — Workers Compensation Utah',
      html: buildAutoReplyHtml(submitterName),
      attachments: [
        {
          filename: 'wcu-logo.png',
          content: Buffer.from(wcuLogoBase64, 'base64'),
          cid: LOGO_CID,
          contentType: 'image/png',
        },
      ],
    })
    return true
  } catch (err) {
    console.error('[auto-reply] failed to send confirmation email:', err)
    return false
  }
}
