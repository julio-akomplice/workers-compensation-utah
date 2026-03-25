'use client'

import React, { useRef, useState } from 'react'
import { TextInput } from './fields/TextInput'
import { TextArea } from './fields/TextArea'
import { RadioGroup } from './fields/RadioGroup'
import { CheckboxGroup } from './fields/CheckboxGroup'
import { getClientSideURL } from '@/utilities/getURL'

type FormData = {
  firstName: string
  lastName: string
  spouseFirstName: string
  spouseLastName: string
  email: string
  phoneNumber: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  workQuestion: string
  requireInterpreter: string
  employerName: string
  employerPhone: string
  dateOfEmployment: string
  jobTitle: string
  wageSalary: string
  hoursPerWeek: string
  hasSecondJob: string
  terminated: string
  returnToWorkDate: string
  lastDayOfWork: string
  reportDate: string
  accidentType: string
  consultedAttorney: string
  accidentDate: string
  endingDateOfIllness: string
  injuryLocation: string
  elsewhereDescription: string
  timeOfInjury: string
  partsOfBodyInjured: string
  howInjuryOccurred: string
  responsibleParties: string[]
  responsibilityExplanation: string
  currentDoctors: string
  otherDoctors: string
  hospitalizedOvernight: string
}

const initialFormData: FormData = {
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
  workQuestion: '',
  requireInterpreter: '',
  employerName: '',
  employerPhone: '',
  dateOfEmployment: '',
  jobTitle: '',
  wageSalary: '',
  hoursPerWeek: '',
  hasSecondJob: '',
  terminated: '',
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
  hospitalizedOvernight: '',
}

const yesNoOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
]

const requiredFields: (keyof FormData)[] = [
  'firstName',
  'lastName',
  'email',
  'phoneNumber',
  'streetAddress',
  'city',
  'state',
  'zipCode',
  'workQuestion',
  'requireInterpreter',
  'employerName',
  'employerPhone',
  'dateOfEmployment',
  'jobTitle',
  'wageSalary',
  'hasSecondJob',
  'terminated',
  'accidentType',
  'howInjuryOccurred',
  'hospitalizedOvernight',
]

export const CaseQuestionnaireForm: React.FC<{ formID: string }> = ({ formID }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Set<keyof FormData>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const validate = (data: FormData): Set<keyof FormData> => {
    const newErrors = new Set<keyof FormData>()
    for (const field of requiredFields) {
      const val = data[field]
      if (Array.isArray(val) ? val.length === 0 : !val.trim()) {
        newErrors.add(field)
      }
    }
    return newErrors
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (submitted) {
      const newErrors = new Set(errors)
      if (value.trim()) newErrors.delete(name as keyof FormData)
      else if (requiredFields.includes(name as keyof FormData))
        newErrors.add(name as keyof FormData)
      setErrors(newErrors)
    }
  }

  const handleRadioChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (submitted) {
      const newErrors = new Set(errors)
      newErrors.delete(name)
      setErrors(newErrors)
    }
  }

  const handleCheckboxChange = (name: keyof FormData, values: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: values }))
    if (submitted) {
      const newErrors = new Set(errors)
      if (values.length > 0) newErrors.delete(name)
      setErrors(newErrors)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setSubmitError(null)

    const validationErrors = validate(formData)
    setErrors(validationErrors)

    if (validationErrors.size > 0) {
      const firstErrorField = requiredFields.find((f) => validationErrors.has(f))
      if (firstErrorField && formRef.current) {
        const el =
          formRef.current.querySelector(`[name="${firstErrorField}"]`) ||
          formRef.current.querySelector(`[data-field="${firstErrorField}"]`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    const submissionData = Object.entries(formData).map(([field, value]) => ({
      field,
      value: Array.isArray(value) ? value.join(', ') : value,
    }))

    setIsLoading(true)

    try {
      const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: formID,
          submissionData,
        }),
      })

      const res = await req.json()

      if (req.status >= 400) {
        setIsLoading(false)
        setSubmitError(res.errors?.[0]?.message || 'Something went wrong. Please try again.')
        return
      }

      setIsLoading(false)
      setHasSubmitted(true)
    } catch {
      setIsLoading(false)
      setSubmitError('Something went wrong. Please try again.')
    }
  }

  if (hasSubmitted) {
    return (
      <div className="flex flex-col items-center gap-6 py-20">
        <h2 className="text-h3 font-semibold tracking-[-0.04em] text-dark-blue text-center">
          Thank You
        </h2>
        <p className="text-body tracking-[-0.32px] text-deep-blue-900 text-center max-w-lg">
          Your case questionnaire has been submitted successfully. Our team will review your
          information and get back to you shortly.
        </p>
      </div>
    )
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
              error={errors.has('firstName')}
            />
            <TextInput
              label="Last Name"
              required
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={errors.has('lastName')}
            />
            <TextInput
              label="Spouse First Name"
              name="spouseFirstName"
              value={formData.spouseFirstName}
              onChange={handleInputChange}
            />
            <TextInput
              label="Spouse Last Name"
              name="spouseLastName"
              value={formData.spouseLastName}
              onChange={handleInputChange}
            />
            <TextInput
              label="Email"
              required
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.has('email')}
            />
            <TextInput
              label="Phone Number"
              required
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={errors.has('phoneNumber')}
            />
            <TextInput
              label="Street Address"
              required
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              fullWidth
              error={errors.has('streetAddress')}
            />
            <TextInput
              label="City"
              required
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              error={errors.has('city')}
            />
            <TextInput
              label="State"
              required
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              error={errors.has('state')}
            />
            <TextInput
              label="Zip Code"
              required
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              error={errors.has('zipCode')}
            />
            <TextInput
              label="Work Question"
              required
              name="workQuestion"
              value={formData.workQuestion}
              onChange={handleInputChange}
              fullWidth
              error={errors.has('workQuestion')}
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
              value={formData.requireInterpreter}
              onChange={(val) => handleRadioChange('requireInterpreter', val)}
              error={errors.has('requireInterpreter')}
            />
            <div className="hidden md:block md:w-[calc(50%-10px)]" />

            <TextInput
              label="Employer Name"
              required
              name="employerName"
              value={formData.employerName}
              onChange={handleInputChange}
              error={errors.has('employerName')}
            />
            <TextInput
              label="Employer's Phone Number"
              required
              name="employerPhone"
              value={formData.employerPhone}
              onChange={handleInputChange}
              error={errors.has('employerPhone')}
            />
            <TextInput
              label="Date of Employment"
              required
              name="dateOfEmployment"
              value={formData.dateOfEmployment}
              onChange={handleInputChange}
              error={errors.has('dateOfEmployment')}
            />
            <TextInput
              label="Job Title"
              required
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              error={errors.has('jobTitle')}
            />
            <TextInput
              label="Wage/Salary"
              required
              name="wageSalary"
              value={formData.wageSalary}
              onChange={handleInputChange}
              error={errors.has('wageSalary')}
            />
            <TextInput
              label="Number of hours scheduled to work per week?"
              name="hoursPerWeek"
              value={formData.hoursPerWeek}
              onChange={handleInputChange}
            />
            <RadioGroup
              label="Do you have a second job?"
              required
              name="hasSecondJob"
              options={yesNoOptions}
              value={formData.hasSecondJob}
              onChange={(val) => handleRadioChange('hasSecondJob', val)}
              error={errors.has('hasSecondJob')}
            />
            <RadioGroup
              label="Have you been terminated/laid off from this job?"
              required
              name="terminated"
              options={yesNoOptions}
              value={formData.terminated}
              onChange={(val) => handleRadioChange('terminated', val)}
              error={errors.has('terminated')}
            />
            <TextInput
              label="If you are currently working, what day did you return to work?"
              name="returnToWorkDate"
              value={formData.returnToWorkDate}
              onChange={handleInputChange}
              fullWidth
            />
            <TextInput
              label="If you are not working, what was your last day of work?"
              name="lastDayOfWork"
              value={formData.lastDayOfWork}
              onChange={handleInputChange}
              fullWidth
            />
            <TextInput
              label="What date did you report your accident/injury to your employer?"
              name="reportDate"
              value={formData.reportDate}
              onChange={handleInputChange}
              fullWidth
            />
            <TextInput
              label="Type of accident, injury, or illness:"
              required
              name="accidentType"
              value={formData.accidentType}
              onChange={handleInputChange}
              error={errors.has('accidentType')}
            />
            <div className="hidden md:block md:w-[calc(50%-10px)]" />

            <RadioGroup
              label="Have you ever consulted another attorney about this accident?"
              name="consultedAttorney"
              options={yesNoOptions}
              value={formData.consultedAttorney}
              onChange={(val) => handleRadioChange('consultedAttorney', val)}
              fullWidth
            />
            <TextInput
              label="Date of accident/injury (or beginning date of illness)"
              name="accidentDate"
              value={formData.accidentDate}
              onChange={handleInputChange}
              fullWidth
            />
            <TextInput
              label="Ending date of illness (if applicable)"
              name="endingDateOfIllness"
              value={formData.endingDateOfIllness}
              onChange={handleInputChange}
            />
            <RadioGroup
              label="Address where injury occured:"
              name="injuryLocation"
              options={[
                { label: 'At work', value: 'at-work' },
                { label: 'Elsewhere', value: 'elsewhere' },
              ]}
              value={formData.injuryLocation}
              onChange={(val) => handleRadioChange('injuryLocation', val)}
            />
            <TextInput
              label="If elsewhere, please describe:"
              name="elsewhereDescription"
              value={formData.elsewhereDescription}
              onChange={handleInputChange}
            />
            <TextInput
              label="Time of injury (AM/PM):"
              name="timeOfInjury"
              value={formData.timeOfInjury}
              onChange={handleInputChange}
            />
            <TextInput
              label="Parts of body injured:"
              name="partsOfBodyInjured"
              value={formData.partsOfBodyInjured}
              onChange={handleInputChange}
              fullWidth
            />
            <TextArea
              label="How did the injury/illness occur?"
              required
              name="howInjuryOccurred"
              value={formData.howInjuryOccurred}
              onChange={handleInputChange}
              error={errors.has('howInjuryOccurred')}
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
              values={formData.responsibleParties}
              onChange={(vals) => handleCheckboxChange('responsibleParties', vals)}
            />
            <TextArea
              label="Please explain the responsibility of any checked above."
              name="responsibilityExplanation"
              value={formData.responsibilityExplanation}
              onChange={handleInputChange}
            />
            <TextArea
              label="Please list your current doctor(s) name and phone number related to this incident:"
              name="currentDoctors"
              value={formData.currentDoctors}
              onChange={handleInputChange}
            />
            <TextArea
              label="Please list other doctors/hospitals you have seen for this injury:"
              name="otherDoctors"
              value={formData.otherDoctors}
              onChange={handleInputChange}
            />
            <RadioGroup
              label="Were you hospitalized overnight?"
              required
              name="hospitalizedOvernight"
              options={yesNoOptions}
              value={formData.hospitalizedOvernight}
              onChange={(val) => handleRadioChange('hospitalizedOvernight', val)}
              fullWidth
              error={errors.has('hospitalizedOvernight')}
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      {submitError && (
        <p className="text-red-500 text-body text-center">{submitError}</p>
      )}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-brand text-white text-cta-primary px-10 py-4 rounded-[6px] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Submitting...' : 'Submit Questionnaire'}
        </button>
      </div>
    </form>
  )
}
