'use client'

import React, { useRef, useState } from 'react'
import { TextInput } from './fields/TextInput'
import { TextArea } from './fields/TextArea'
import { RadioGroup } from './fields/RadioGroup'
import { CheckboxGroup } from './fields/CheckboxGroup'
import { PhoneField } from './fields/PhoneField'
import { SingleCheckbox } from './fields/SingleCheckbox'
import { getClientSideURL } from '@/utilities/getURL'
import { caseQuestionnaireSchema, type CaseQuestionnaireData } from '@/utilities/caseQuestionnaireSchema'
import { CheckCircleIcon } from '@/components/ui/icons/CheckCircleIcon'
import { CancelIcon } from '@/components/ui/icons/CancelIcon'

type FieldErrors = Partial<Record<keyof CaseQuestionnaireData, string>>

const initialFormData: CaseQuestionnaireData = {
  firstName: '',
  lastName: '',
  spouseFirstName: '',
  spouseLastName: '',
  email: '',
  phoneNumber: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  requireInterpreter: undefined as unknown as 'yes' | 'no',
  employerName: '',
  employerPhone: '',
  dateOfEmployment: '',
  jobTitle: '',
  wageSalary: '',
  hoursPerWeek: '',
  hasSecondJob: undefined as unknown as 'yes' | 'no',
  terminated: undefined as unknown as 'yes' | 'no',
  returnToWorkDate: '',
  lastDayOfWork: '',
  reportDate: '',
  accidentType: '',
  consultedAttorney: '',
  accidentDate: '',
  endingDateOfIllness: '',
  injuryLocation: '',
  elsewhereDescription: '',
  timeOfInjury: '',
  partsOfBodyInjured: '',
  howInjuryOccurred: '',
  responsibleParties: [],
  responsibilityExplanation: '',
  currentDoctors: '',
  otherDoctors: '',
  hospitalizedOvernight: undefined as unknown as 'yes' | 'no',
  // Insurance, Benefits & Medical History
  wcInsuranceCompany: '',
  wcInsurancePhone: '',
  hasPrivateMedicalInsurance: undefined as unknown as 'yes' | 'no',
  datesNotWorked: '',
  appliedForSocialSecurity: undefined as unknown as 'yes' | 'no',
  priorBodyPartInjury: undefined as unknown as 'yes' | 'no',
  priorInjuryLocation: undefined as unknown as 'yes' | 'no',
  otherJobInjuries: undefined as unknown as 'yes' | 'no',
  priorWcClaims: undefined as unknown as 'yes' | 'no',
  offJobInjuries: undefined as unknown as 'yes' | 'no',
  filedClaimOrLawsuit: undefined as unknown as 'yes' | 'no',
  agreementAccepted: false,
  claimsAdjusterName: '',
  claimsAdjusterPhone: '',
  claimNumber: '',
  claimDenied: '' as '' | 'yes' | 'no',
  whoPayedTreatment: [],
  unpaidMedicalBills: '',
  wcBenefitsDates: '',
  otherBenefits: '',
  priorInjuryDoctors: '',
  otherMedicalConditions: '',
  otherConditionsDoctors: '',
}

const testDefaultValues: CaseQuestionnaireData = {
  firstName: 'John',
  lastName: 'Doe',
  spouseFirstName: 'Jane',
  spouseLastName: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '8015550123',
  streetAddress: '123 Main St',
  city: 'Salt Lake City',
  state: 'Utah',
  zipCode: '84101',
  requireInterpreter: 'no',
  employerName: 'Acme Corporation',
  employerPhone: '8015550199',
  dateOfEmployment: '01/15/2020',
  jobTitle: 'Warehouse Associate',
  wageSalary: '$18/hr',
  hoursPerWeek: '40',
  hasSecondJob: 'no',
  terminated: 'no',
  returnToWorkDate: '',
  lastDayOfWork: '03/10/2024',
  reportDate: '03/11/2024',
  accidentType: 'Slip and fall on wet floor',
  consultedAttorney: 'no',
  accidentDate: '03/10/2024',
  endingDateOfIllness: '',
  injuryLocation: 'at-work',
  elsewhereDescription: '',
  timeOfInjury: '2:30 PM',
  partsOfBodyInjured: 'Lower back, right knee',
  howInjuryOccurred:
    'I slipped on a wet floor near the loading dock. There were no warning signs posted. I fell backwards and landed on my lower back and right knee.',
  responsibleParties: ['employer', 'unsafe-condition'],
  responsibilityExplanation:
    'The employer failed to post wet floor signs and the unsafe condition of the floor caused the accident.',
  currentDoctors: 'Dr. Smith — 801-555-0150',
  otherDoctors: 'Salt Lake Regional Medical Center — 801-555-0100',
  hospitalizedOvernight: 'yes',
  // Insurance, Benefits & Medical History
  wcInsuranceCompany: 'Utah State Workers Compensation Fund',
  wcInsurancePhone: '8015230400',
  hasPrivateMedicalInsurance: 'yes',
  datesNotWorked: '03/10/2024 – 04/15/2024',
  appliedForSocialSecurity: 'no',
  priorBodyPartInjury: 'no',
  priorInjuryLocation: 'no',
  otherJobInjuries: 'no',
  priorWcClaims: 'no',
  offJobInjuries: 'no',
  filedClaimOrLawsuit: 'no',
  agreementAccepted: true,
  claimsAdjusterName: 'Jane Adams',
  claimsAdjusterPhone: '8015550177',
  claimNumber: 'WC-2024-00123',
  claimDenied: 'no',
  whoPayedTreatment: ['workers-comp-insurance'],
  unpaidMedicalBills: 'Salt Lake Regional — $1,200.00\nDr. Smith Office Visit — $350.00',
  wcBenefitsDates: '03/15/2024 – 04/15/2024',
  otherBenefits: 'None',
  priorInjuryDoctors: '',
  otherMedicalConditions: '',
  otherConditionsDoctors: '',
}

const yesNoOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
]

export const CaseQuestionnaireForm: React.FC<{ formID: string }> = ({ formID }) => {
  const [formData, setFormData] = useState<CaseQuestionnaireData>(
    process.env.NODE_ENV === 'development' ? testDefaultValues : initialFormData,
  )
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const validate = (data: CaseQuestionnaireData): FieldErrors => {
    const result = caseQuestionnaireSchema.safeParse(data)
    if (result.success) return {}
    const fieldErrors: FieldErrors = {}
    for (const [field, messages] of Object.entries(result.error.flatten().fieldErrors)) {
      if (messages?.[0]) {
        fieldErrors[field as keyof CaseQuestionnaireData] = messages[0]
      }
    }
    return fieldErrors
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    const key = name as keyof CaseQuestionnaireData
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const handleRadioChange = (name: keyof CaseQuestionnaireData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleCheckboxChange = (name: keyof CaseQuestionnaireData, values: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: values }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleAgreementChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreementAccepted: checked }))
    if (errors.agreementAccepted) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.agreementAccepted
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    const validationErrors = validate(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorKey = Object.keys(validationErrors)[0]
      if (firstErrorKey && formRef.current) {
        const el =
          formRef.current.querySelector(`[name="${firstErrorKey}"]`) ||
          formRef.current.querySelector(`[data-field="${firstErrorKey}"]`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setIsLoading(true)

    try {
      // 1. Save to Payload form-submissions to get a record ID
      const submissionData = Object.entries(formData).map(([field, value]) => ({
        field,
        value: Array.isArray(value) ? value.join(', ') : String(value ?? ''),
      }))

      const submissionRes = await fetch(`${getClientSideURL()}/api/form-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formID, submissionData }),
      })

      const submissionJson = await submissionRes.json()

      if (!submissionRes.ok) {
        setIsLoading(false)
        setSubmitError(submissionJson.errors?.[0]?.message || 'Something went wrong. Please try again.')
        return
      }

      const submissionId: string | undefined =
        submissionJson.doc?.id != null ? String(submissionJson.doc.id) : undefined

      // 2. Send the email with the real submission ID
      const emailRes = await fetch(`${getClientSideURL()}/api/send-case-questionnaire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, submissionId }),
      })

      const emailJson = await emailRes.json()

      if (!emailRes.ok) {
        setIsLoading(false)
        setSubmitError(emailJson.error || 'Something went wrong. Please try again.')
        return
      }

      setIsLoading(false)
      setHasSubmitted(true)
      setFormData(process.env.NODE_ENV === 'development' ? testDefaultValues : initialFormData)
    } catch {
      setIsLoading(false)
      setSubmitError('Something went wrong. Please try again.')
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-15 md:gap-[60px]">
      {/* Basic Information */}
      <div className="flex flex-col items-center gap-[35px]">
        <h2 className="text-h3 font-semibold tracking-[-0.04em] text-dark-blue text-center">
          Basic Information
        </h2>
        <div className="w-full max-w-[810px] bg-off-white rounded-[10px] p-[30px]">
          <div className="flex flex-wrap gap-y-5 justify-between">
            <TextInput
              label="First Name"
              required
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={!!errors.firstName}
              errorMessage={errors.firstName}
            />
            <TextInput
              label="Last Name"
              required
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={!!errors.lastName}
              errorMessage={errors.lastName}
            />
            <TextInput
              label="Spouse First Name"
              name="spouseFirstName"
              value={formData.spouseFirstName ?? ''}
              onChange={handleInputChange}
              error={!!errors.spouseFirstName}
              errorMessage={errors.spouseFirstName}
            />
            <TextInput
              label="Spouse Last Name"
              name="spouseLastName"
              value={formData.spouseLastName ?? ''}
              onChange={handleInputChange}
              error={!!errors.spouseLastName}
              errorMessage={errors.spouseLastName}
            />
            <TextInput
              label="Email"
              required
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              errorMessage={errors.email}
            />
            <PhoneField
              label="Phone Number"
              required
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={!!errors.phoneNumber}
              errorMessage={errors.phoneNumber}
            />
            <TextInput
              label="Street Address"
              required
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.streetAddress}
              errorMessage={errors.streetAddress}
            />
            <TextInput
              label="City"
              required
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              error={!!errors.city}
              errorMessage={errors.city}
            />
            <TextInput
              label="State"
              required
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              error={!!errors.state}
              errorMessage={errors.state}
            />
            <TextInput
              label="Zip Code"
              required
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              error={!!errors.zipCode}
              errorMessage={errors.zipCode}
            />
          </div>
        </div>
      </div>

      {/* Employment & Injury Report Details */}
      <div className="flex flex-col items-center gap-[35px]">
        <h2 className="text-h3 font-semibold tracking-[-0.04em] text-dark-blue text-center">
          Employment &amp; Injury Report Details
        </h2>
        <div className="w-full max-w-[810px] bg-off-white rounded-[10px] p-[30px]">
          <div className="flex flex-wrap gap-y-[25px] justify-between">
            <RadioGroup
              label="Do You Require an Interpreter?"
              required
              name="requireInterpreter"
              options={yesNoOptions}
              value={formData.requireInterpreter ?? ''}
              onChange={(val) => handleRadioChange('requireInterpreter', val)}
              error={!!errors.requireInterpreter}
              errorMessage={errors.requireInterpreter}
            />
            <div className="hidden md:block md:w-[calc(50%-10px)]" />

            <TextInput
              label="Employer Name"
              required
              name="employerName"
              value={formData.employerName}
              onChange={handleInputChange}
              error={!!errors.employerName}
              errorMessage={errors.employerName}
            />
            <PhoneField
              label="Employer's Phone Number"
              required
              name="employerPhone"
              value={formData.employerPhone}
              onChange={handleInputChange}
              error={!!errors.employerPhone}
              errorMessage={errors.employerPhone}
            />
            <TextInput
              label="Date of Employment"
              required
              name="dateOfEmployment"
              value={formData.dateOfEmployment}
              onChange={handleInputChange}
              error={!!errors.dateOfEmployment}
              errorMessage={errors.dateOfEmployment}
            />
            <TextInput
              label="Job Title"
              required
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              error={!!errors.jobTitle}
              errorMessage={errors.jobTitle}
            />
            <TextInput
              label="Wage/Salary"
              required
              name="wageSalary"
              value={formData.wageSalary}
              onChange={handleInputChange}
              error={!!errors.wageSalary}
              errorMessage={errors.wageSalary}
            />
            <TextInput
              label="Number of hours scheduled to work per week?"
              name="hoursPerWeek"
              value={formData.hoursPerWeek ?? ''}
              onChange={handleInputChange}
              error={!!errors.hoursPerWeek}
              errorMessage={errors.hoursPerWeek}
            />
            <RadioGroup
              label="Do you have a second job?"
              required
              name="hasSecondJob"
              options={yesNoOptions}
              value={formData.hasSecondJob ?? ''}
              onChange={(val) => handleRadioChange('hasSecondJob', val)}
              error={!!errors.hasSecondJob}
              errorMessage={errors.hasSecondJob}
            />
            <RadioGroup
              label="Have you been terminated/laid off from this job?"
              required
              name="terminated"
              options={yesNoOptions}
              value={formData.terminated ?? ''}
              onChange={(val) => handleRadioChange('terminated', val)}
              error={!!errors.terminated}
              errorMessage={errors.terminated}
            />
            <TextInput
              label="If you are currently working, what day did you return to work?"
              name="returnToWorkDate"
              value={formData.returnToWorkDate ?? ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextInput
              label="If you are not working, what was your last day of work?"
              name="lastDayOfWork"
              value={formData.lastDayOfWork ?? ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextInput
              label="What date did you report your accident/injury to your employer?"
              name="reportDate"
              value={formData.reportDate ?? ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextInput
              label="Type of accident, injury, or illness:"
              required
              name="accidentType"
              value={formData.accidentType}
              onChange={handleInputChange}
              error={!!errors.accidentType}
              errorMessage={errors.accidentType}
            />
            <div className="hidden md:block md:w-[calc(50%-10px)]" />

            <RadioGroup
              label="Have you ever consulted another attorney about this accident?"
              name="consultedAttorney"
              options={yesNoOptions}
              value={formData.consultedAttorney ?? ''}
              onChange={(val) => handleRadioChange('consultedAttorney', val)}
              fullWidth
            />
            <TextInput
              label="Date of accident/injury (or beginning date of illness)"
              name="accidentDate"
              value={formData.accidentDate ?? ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextInput
              label="Ending date of illness (if applicable)"
              name="endingDateOfIllness"
              value={formData.endingDateOfIllness ?? ''}
              onChange={handleInputChange}
            />
            <RadioGroup
              label="Address where injury occured:"
              name="injuryLocation"
              options={[
                { label: 'At work', value: 'at-work' },
                { label: 'Elsewhere', value: 'elsewhere' },
              ]}
              value={formData.injuryLocation ?? ''}
              onChange={(val) => handleRadioChange('injuryLocation', val)}
            />
            <TextInput
              label="If elsewhere, please describe:"
              name="elsewhereDescription"
              value={formData.elsewhereDescription ?? ''}
              onChange={handleInputChange}
            />
            <TextInput
              label="Time of injury (AM/PM):"
              name="timeOfInjury"
              value={formData.timeOfInjury ?? ''}
              onChange={handleInputChange}
            />
            <TextInput
              label="Parts of body injured:"
              name="partsOfBodyInjured"
              value={formData.partsOfBodyInjured ?? ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextArea
              label="How did the injury/illness occur?"
              required
              name="howInjuryOccurred"
              value={formData.howInjuryOccurred}
              onChange={handleInputChange}
              error={!!errors.howInjuryOccurred}
              errorMessage={errors.howInjuryOccurred}
            />
            <CheckboxGroup
              label="Who is responsible for the injury/illness? Please check all that apply."
              options={[
                { label: 'Employer', value: 'employer' },
                { label: 'Co-Employee', value: 'co-employee' },
                { label: 'Someone Else', value: 'someone-else' },
                { label: 'Unsafe Condition', value: 'unsafe-condition' },
                { label: 'Machine', value: 'machine' },
                { label: 'Chemical Substance', value: 'chemical-substance' },
              ]}
              values={formData.responsibleParties ?? []}
              onChange={(vals) => handleCheckboxChange('responsibleParties', vals)}
            />
            <TextArea
              label="Please explain the responsibility of any checked above."
              name="responsibilityExplanation"
              value={formData.responsibilityExplanation ?? ''}
              onChange={handleInputChange}
            />
            <TextArea
              label="Please list your current doctor(s) name and phone number related to this incident:"
              name="currentDoctors"
              value={formData.currentDoctors ?? ''}
              onChange={handleInputChange}
            />
            <TextArea
              label="Please list other doctors/hospitals you have seen for this injury:"
              name="otherDoctors"
              value={formData.otherDoctors ?? ''}
              onChange={handleInputChange}
            />
            <RadioGroup
              label="Were you hospitalized overnight?"
              required
              name="hospitalizedOvernight"
              options={yesNoOptions}
              value={formData.hospitalizedOvernight ?? ''}
              onChange={(val) => handleRadioChange('hospitalizedOvernight', val)}
              fullWidth
              error={!!errors.hospitalizedOvernight}
              errorMessage={errors.hospitalizedOvernight}
            />
          </div>
        </div>
      </div>

      {/* Insurance, Benefits & Medical History */}
      <div className="flex flex-col items-center gap-[35px]">
        <h2 className="text-h3 font-semibold tracking-[-0.04em] text-dark-blue text-center">
          Insurance, Benefits &amp; Medical History
        </h2>
        <div className="w-full max-w-[810px] bg-off-white rounded-[10px] p-[30px]">
          <div className="flex flex-wrap gap-y-5 justify-between">
            <TextInput
              label="Name of Workers' Compensation Insurance Company:"
              required
              name="wcInsuranceCompany"
              value={formData.wcInsuranceCompany}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.wcInsuranceCompany}
              errorMessage={errors.wcInsuranceCompany}
            />
            <PhoneField
              label="Workers' Compensation Insurance Company Phone:"
              required
              name="wcInsurancePhone"
              value={formData.wcInsurancePhone}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.wcInsurancePhone}
              errorMessage={errors.wcInsurancePhone}
            />
            <TextInput
              label="Name of Claims Adjuster:"
              name="claimsAdjusterName"
              value={formData.claimsAdjusterName ?? ''}
              onChange={handleInputChange}
              error={!!errors.claimsAdjusterName}
              errorMessage={errors.claimsAdjusterName}
            />
            <PhoneField
              label="Claim Adjuster Phone Number:"
              name="claimsAdjusterPhone"
              value={formData.claimsAdjusterPhone ?? ''}
              onChange={handleInputChange}
              error={!!errors.claimsAdjusterPhone}
              errorMessage={errors.claimsAdjusterPhone}
            />
            <TextInput
              label="Claim Number:"
              name="claimNumber"
              value={formData.claimNumber ?? ''}
              onChange={handleInputChange}
              error={!!errors.claimNumber}
              errorMessage={errors.claimNumber}
            />
            <RadioGroup
              label="Has your claim been denied?"
              name="claimDenied"
              options={yesNoOptions}
              value={formData.claimDenied ?? ''}
              onChange={(val) => handleRadioChange('claimDenied', val)}
            />
            <RadioGroup
              label="Do you have private medical insurance?"
              required
              name="hasPrivateMedicalInsurance"
              options={yesNoOptions}
              value={formData.hasPrivateMedicalInsurance ?? ''}
              onChange={(val) => handleRadioChange('hasPrivateMedicalInsurance', val)}
              error={!!errors.hasPrivateMedicalInsurance}
              errorMessage={errors.hasPrivateMedicalInsurance}
            />
            <div className="hidden md:block md:w-[calc(50%-10px)]" />
            <CheckboxGroup
              label="Who paid for your treatment?"
              options={[
                { label: "Workers' Compensation Insurance", value: 'workers-comp-insurance' },
                { label: 'Private Medical Insurance', value: 'private-medical-insurance' },
                { label: 'Medicaid (State)', value: 'medicaid' },
                { label: 'Medicare (Federal)', value: 'medicare' },
                { label: 'Yourself', value: 'yourself' },
              ]}
              values={formData.whoPayedTreatment ?? []}
              onChange={(vals) => handleCheckboxChange('whoPayedTreatment', vals)}
            />
            <TextArea
              label="Please list all unpaid medical bills and include amounts due:"
              name="unpaidMedicalBills"
              value={formData.unpaidMedicalBills ?? ''}
              onChange={handleInputChange}
            />
            <TextArea
              label="Please list the start and end dates you did not work due to injury or illness:"
              required
              name="datesNotWorked"
              value={formData.datesNotWorked}
              onChange={handleInputChange}
              error={!!errors.datesNotWorked}
              errorMessage={errors.datesNotWorked}
            />
            <TextArea
              label="Please list the start and end dates you received Workers' Compensation Benefits:"
              name="wcBenefitsDates"
              value={formData.wcBenefitsDates ?? ''}
              onChange={handleInputChange}
            />
            <RadioGroup
              label="Have you applied for Social Security Disability?"
              required
              name="appliedForSocialSecurity"
              options={yesNoOptions}
              value={formData.appliedForSocialSecurity ?? ''}
              onChange={(val) => handleRadioChange('appliedForSocialSecurity', val)}
              fullWidth
              error={!!errors.appliedForSocialSecurity}
              errorMessage={errors.appliedForSocialSecurity}
            />
            <TextArea
              label="Please list any type of benefits, amounts and dates received from other sources. Please include State Disability, Unemployment, Social Security, Long Term Disability, Retirement/Pension, or any other source of benefits."
              name="otherBenefits"
              value={formData.otherBenefits ?? ''}
              onChange={handleInputChange}
            />
            <RadioGroup
              label="Have you ever injured this body part before?"
              required
              name="priorBodyPartInjury"
              options={yesNoOptions}
              value={formData.priorBodyPartInjury ?? ''}
              onChange={(val) => handleRadioChange('priorBodyPartInjury', val)}
              fullWidth
              error={!!errors.priorBodyPartInjury}
              errorMessage={errors.priorBodyPartInjury}
            />
            <RadioGroup
              label="If previous injury exists, did it occur at work or elsewhere?"
              required
              name="priorInjuryLocation"
              options={yesNoOptions}
              value={formData.priorInjuryLocation ?? ''}
              onChange={(val) => handleRadioChange('priorInjuryLocation', val)}
              fullWidth
              error={!!errors.priorInjuryLocation}
              errorMessage={errors.priorInjuryLocation}
            />
            <RadioGroup
              label="Have you ever had any other on-the-job injuries/illnesses?"
              required
              name="otherJobInjuries"
              options={yesNoOptions}
              value={formData.otherJobInjuries ?? ''}
              onChange={(val) => handleRadioChange('otherJobInjuries', val)}
              fullWidth
              error={!!errors.otherJobInjuries}
              errorMessage={errors.otherJobInjuries}
            />
            <RadioGroup
              label="Any prior workers' compensation claims?"
              required
              name="priorWcClaims"
              options={yesNoOptions}
              value={formData.priorWcClaims ?? ''}
              onChange={(val) => handleRadioChange('priorWcClaims', val)}
              fullWidth
              error={!!errors.priorWcClaims}
              errorMessage={errors.priorWcClaims}
            />
            <RadioGroup
              label="Have you had any off-the-job injuries/illnesses?"
              required
              name="offJobInjuries"
              options={yesNoOptions}
              value={formData.offJobInjuries ?? ''}
              onChange={(val) => handleRadioChange('offJobInjuries', val)}
              fullWidth
              error={!!errors.offJobInjuries}
              errorMessage={errors.offJobInjuries}
            />
            <TextArea
              label="Please list any doctors/hospitals you have seen due to the above listed injuries/illnesses or workers' compensation claims:"
              name="priorInjuryDoctors"
              value={formData.priorInjuryDoctors ?? ''}
              onChange={handleInputChange}
            />
            <RadioGroup
              label="Have you ever filed a claim or lawsuit for a work injury or personal injury?"
              required
              name="filedClaimOrLawsuit"
              options={yesNoOptions}
              value={formData.filedClaimOrLawsuit ?? ''}
              onChange={(val) => handleRadioChange('filedClaimOrLawsuit', val)}
              fullWidth
              error={!!errors.filedClaimOrLawsuit}
              errorMessage={errors.filedClaimOrLawsuit}
            />
            <TextArea
              label="List other medical conditions that limit your ability to work and/or require ongoing medical care. This includes heart disease, arthritis, etc:"
              name="otherMedicalConditions"
              value={formData.otherMedicalConditions ?? ''}
              onChange={handleInputChange}
            />
            <TextArea
              label="Please list any doctors/hospitals you have seen for the above medical conditions:"
              name="otherConditionsDoctors"
              value={formData.otherConditionsDoctors ?? ''}
              onChange={handleInputChange}
            />

            {/* Agreement */}
            <div className="w-full flex flex-col gap-2.5" data-field="agreementAccepted">
              <p className="text-body tracking-[-0.32px] text-off-black font-semibold">
                Agreement<span className="text-orange">*</span>
              </p>
              <div className="bg-white border border-navy-50 rounded-md h-39.5 overflow-y-auto px-3 py-4 text-[14px] leading-5.5 tracking-[-0.28px] text-navy-900">
                <p>
                  By sending us your completed questionnaire, you will be asking us to look at your
                  case and to consider representing you. Sending us a completed questionnaire does
                  NOT mean that we will take your case. All communications from you to us will be
                  kept strictly confidential regardless of whether we become your attorneys.
                </p>
                <br />
                <p>
                  Please also be aware that sending us a completed questionnaire does not mean that
                  we will take any action to preserve your rights or to file a timely claim or
                  lawsuit unless we accept your case and agree to represent you.
                </p>
                <br />
                <p>
                  All legal claims have time limits for filing. It is always wise to seek the
                  opinion of a qualified, competent attorney as soon as possible after an injury
                  occurs so that evidence may be gathered and preserved, and important deadlines can
                  be met in order to hold all responsible parties accountable.
                </p>
                <br />
                <p>
                  By clicking &ldquo;I Accept,&rdquo; you confirm that you have read the terms and
                  conditions stated above, and that you agree to be bound by them.
                </p>
              </div>
              <SingleCheckbox
                name="agreementAccepted"
                label="I have read, understand and agree to the Terms and Conditions."
                checked={formData.agreementAccepted}
                onChange={handleAgreementChange}
                error={!!errors.agreementAccepted}
                errorMessage={errors.agreementAccepted}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col items-center gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-brand text-white text-cta-primary px-10 py-4 rounded-[6px] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Submitting...' : 'Submit Questionnaire'}
        </button>

        {submitError && (
          <div className="flex items-center gap-1.5">
            <CancelIcon className="shrink-0" />
            <p className="text-base tracking-[-0.32px] text-[#FF3C3C]">{submitError}</p>
          </div>
        )}

        {hasSubmitted && !submitError && (
          <div className="flex items-center gap-1.5">
            <CheckCircleIcon className="shrink-0" />
            <p className="text-base tracking-[-0.32px] text-[#32C62F]">
              Your case questionnaire has been submitted. Our team will review your information and
              get back to you shortly.
            </p>
          </div>
        )}
      </div>
    </form>
  )
}
