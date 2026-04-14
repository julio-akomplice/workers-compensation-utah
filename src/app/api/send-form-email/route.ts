import { NextRequest, NextResponse } from 'next/server'
import { createGmailTransport } from '@/utilities/gmailTransport'
import { sendFormEmailSchema } from '@/utilities/buildFormSchema'

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

    const { submissionData, labelMap = {}, submissionId, sourceUrl } = parsed.data

    const recipient =
      process.env.NODE_ENV === 'production'
        ? process.env.FORM_RECIPIENT
        : process.env.TEST_FORM_RECIPIENT

    if (!recipient) {
      return NextResponse.json({ error: 'No recipient configured' }, { status: 500 })
    }

    const rows = submissionData
      .filter(({ field }) => field !== 'sourceUrl')
      .map(({ field, value }) => {
        const label = labelMap[field] ?? field
        return `
          <tr>
            <td style="padding:10px 16px;font-weight:600;color:#374151;background:#f9fafb;width:140px;border-bottom:1px solid #e5e7eb;">${label}</td>
            <td style="padding:10px 16px;color:#111827;border-bottom:1px solid #e5e7eb;">${value}</td>
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
            You have received a new submission from <strong>${submitterName}</strong>${submitterEmail ? ` (<a href="mailto:${submitterEmail}" style="color:#1e3a5f;">${submitterEmail}</a>)` : ''}.
            ${submissionId ? `<br/><span style="color:#9ca3af;font-size:13px;">Record ID: ${submissionId}</span>` : ''}
            ${sourceUrl ? `<br/><span style="color:#9ca3af;font-size:13px;">Submitted from: <a href="${sourceUrl}" style="color:#9ca3af;text-decoration:none;cursor:auto;">${sourceUrl}</a></span>` : ''}
          </p>
        </div>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb;">
          ${rows}
        </table>
        <div style="padding:16px 32px;background:#f9fafb;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">This email was sent automatically from your website contact form.</p>
        </div>
      </div>`

    const transport = createGmailTransport()
    await transport.sendMail({
      to: recipient,
      from: `"Workers Compensation Utah" <${process.env.GMAIL_FROM_ADDRESS}>`,
      replyTo: submitterEmail ? `"${submitterName}" <${submitterEmail}>` : undefined,
      subject: `New inquiry${submissionId ? ` [#${submissionId}]` : ''}`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[send-form-email] error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
