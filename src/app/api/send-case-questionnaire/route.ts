import { NextRequest, NextResponse } from 'next/server'
import { createGmailTransport } from '@/utilities/gmailTransport'
import { caseQuestionnaireEmailSchema } from '@/utilities/caseQuestionnaireSchema'

// Maps raw option values to human-readable display labels
const valueDisplayMap: Record<string, Record<string, string>> = {
  requireInterpreter: { yes: 'Yes', no: 'No' },
  hasSecondJob: { yes: 'Yes', no: 'No' },
  terminated: { yes: 'Yes', no: 'No' },
  consultedAttorney: { yes: 'Yes', no: 'No' },
  hospitalizedOvernight: { yes: 'Yes', no: 'No' },
  injuryLocation: { 'at-work': 'At Work', elsewhere: 'Elsewhere' },
  responsibleParties: {
    employer: 'Employer',
    'co-employee': 'Co-Employee',
    'someone-else': 'Someone Else',
    'unsafe-condition': 'Unsafe Condition',
    machine: 'Machine',
    'chemical-substance': 'Chemical Substance',
  },
}

const labelMap: Record<string, string> = {
  firstName: 'First Name',
  lastName: 'Last Name',
  spouseFirstName: 'Spouse First Name',
  spouseLastName: 'Spouse Last Name',
  email: 'Email',
  phoneNumber: 'Phone Number',
  streetAddress: 'Street Address',
  city: 'City',
  state: 'State',
  zipCode: 'ZIP Code',
  workQuestion: 'Work Question',
  requireInterpreter: 'Requires Interpreter',
  employerName: 'Employer Name',
  employerPhone: "Employer's Phone",
  dateOfEmployment: 'Date of Employment',
  jobTitle: 'Job Title',
  wageSalary: 'Wage / Salary',
  hoursPerWeek: 'Hours Per Week',
  hasSecondJob: 'Has Second Job',
  terminated: 'Terminated / Laid Off',
  returnToWorkDate: 'Return to Work Date',
  lastDayOfWork: 'Last Day of Work',
  reportDate: 'Date Accident Reported',
  accidentType: 'Type of Accident / Injury',
  consultedAttorney: 'Consulted Attorney Before',
  accidentDate: 'Date of Accident / Injury',
  endingDateOfIllness: 'Ending Date of Illness',
  injuryLocation: 'Injury Location',
  elsewhereDescription: 'Injury Location Description',
  timeOfInjury: 'Time of Injury',
  partsOfBodyInjured: 'Parts of Body Injured',
  howInjuryOccurred: 'How Injury Occurred',
  responsibleParties: 'Responsible Parties',
  responsibilityExplanation: 'Responsibility Explanation',
  currentDoctors: 'Current Doctors',
  otherDoctors: 'Other Doctors / Hospitals',
  hospitalizedOvernight: 'Hospitalized Overnight',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = caseQuestionnaireEmailSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const data = parsed.data

    const recipient =
      process.env.NODE_ENV === 'production'
        ? process.env.FORM_RECIPIENT
        : process.env.TEST_FORM_RECIPIENT

    if (!recipient) {
      return NextResponse.json({ error: 'No recipient configured' }, { status: 500 })
    }

    const submissionId = parsed.data.submissionId

    const rows = Object.keys(labelMap)
      .map((field) => {
        const val = (data as Record<string, unknown>)[field]
        const label = labelMap[field]
        const isEmpty =
          val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)
        const displayMap = valueDisplayMap[field]
        const display = isEmpty
          ? '—'
          : Array.isArray(val)
            ? val.map((v) => displayMap?.[v] ?? v).join(', ')
            : (displayMap?.[String(val)] ?? String(val))
        const cellStyle = isEmpty ? 'color:#9ca3af;' : 'color:#111827;'
        return `
          <tr>
            <td style="padding:10px 16px;font-weight:600;color:#374151;background:#f9fafb;width:180px;border-bottom:1px solid #e5e7eb;">${label}</td>
            <td style="padding:10px 16px;${cellStyle}border-bottom:1px solid #e5e7eb;">${display}</td>
          </tr>`
      })
      .join('')

    const submitterName = [data.firstName, data.lastName].filter(Boolean).join(' ') || 'Visitor'
    const submitterEmail = data.email ?? ''

    const html = `
      <div style="font-family:sans-serif;max-width:640px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div style="background:#1e3a5f;padding:24px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;">New Case Questionnaire</h1>
          <p style="margin:4px 0 0;color:#93c5fd;font-size:14px;">Workers Compensation Utah</p>
        </div>
        <div style="padding:24px 32px;">
          <p style="margin:0;color:#374151;font-size:15px;">
            You have received a new case questionnaire from <strong>${submitterName}</strong>${submitterEmail ? ` (<a href="mailto:${submitterEmail}" style="color:#1e3a5f;">${submitterEmail}</a>)` : ''}.
            ${submissionId ? `<br/><span style="color:#9ca3af;font-size:13px;">Submission ID: #${submissionId}</span>` : ''}
          </p>
        </div>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb;">
          ${rows}
        </table>
        <div style="padding:16px 32px;background:#f9fafb;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">This email was sent automatically from the case questionnaire form.</p>
        </div>
      </div>`

    const transport = createGmailTransport()
    await transport.sendMail({
      to: recipient,
      from: `"Workers Compensation Utah" <${process.env.GMAIL_FROM_ADDRESS}>`,
      replyTo: submitterEmail ? `"${submitterName}" <${submitterEmail}>` : undefined,
      subject: `Case Questionnaire${submissionId ? ` [#${submissionId}]` : ''}`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[send-case-questionnaire] error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
