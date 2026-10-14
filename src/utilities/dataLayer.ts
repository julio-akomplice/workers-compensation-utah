/**
 * GTM dataLayer events. Event names must match the Custom Event triggers in
 * container GTM-5LWG3885 exactly (case-sensitive):
 *   wcu_lead_submit            → Google Ads "Form Conversion Tracking" + GA4
 *   wcu_questionnaire_complete → GA4 only
 *
 * Push only after /api/form-submissions confirms the lead was saved — never on
 * button click or validation failure. lead_email / lead_phone feed Google Ads
 * enhanced conversions via a User-Provided Data variable in GTM.
 */

type LeadFields = Record<string, unknown>

type LeadPayload = {
  formName: string
  fields: LeadFields
}

const findValue = (fields: LeadFields, pattern: RegExp) => {
  const key = Object.keys(fields).find((k) => pattern.test(k))
  const value = key ? fields[key] : undefined
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

// US numbers only (the forms validate 10-digit US numbers): 801-555-1234 → +18015551234
const toE164 = (phone: string | undefined) => {
  if (!phone) return undefined
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return undefined
}

const push = (event: string, { formName, fields }: LeadPayload) => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event,
    form_name: formName,
    form_location: window.location.pathname,
    lead_email: findValue(fields, /email/i)?.toLowerCase(),
    lead_phone: toE164(findValue(fields, /phone/i)),
  })
}

export const pushLeadSubmit = (payload: LeadPayload) => push('wcu_lead_submit', payload)

export const pushQuestionnaireComplete = (payload: LeadPayload) =>
  push('wcu_questionnaire_complete', payload)
