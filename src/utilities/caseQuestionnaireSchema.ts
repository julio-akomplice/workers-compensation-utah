import { z } from 'zod'

const phoneValidator = z.string().refine((val) => {
  const digits = val.replace(/\D/g, '')
  return digits.length === 10 && !/^[01]/.test(digits)
}, 'Please enter a valid 10-digit US phone number')

const optionalPhoneValidator = z
  .union([
    z.literal(''),
    z.string().refine((val) => {
      const digits = val.replace(/\D/g, '')
      return digits.length === 10 && !/^[01]/.test(digits)
    }, 'Please enter a valid 10-digit US phone number'),
  ])
  .optional()

export const caseQuestionnaireSchema = z.object({
  // ── Basic Information (required) ─────────────────────────────────────────
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be 50 characters or less'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be 50 characters or less'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(254, 'Email must be 254 characters or less'),
  phoneNumber: phoneValidator,
  streetAddress: z
    .string()
    .min(2, 'Street address must be at least 2 characters')
    .max(100, 'Street address must be 100 characters or less'),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be 50 characters or less'),
  state: z
    .string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be 50 characters or less'),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code (e.g. 84101)'),
  workQuestion: z
    .string()
    .min(2, 'This field must be at least 2 characters')
    .max(500, 'This field must be 500 characters or less'),

  // ── Basic Information (optional) ─────────────────────────────────────────
  spouseFirstName: z
    .string()
    .max(50, 'Spouse first name must be 50 characters or less')
    .optional()
    .or(z.literal('')),
  spouseLastName: z
    .string()
    .max(50, 'Spouse last name must be 50 characters or less')
    .optional()
    .or(z.literal('')),

  // ── Employment & Injury (required) ───────────────────────────────────────
  requireInterpreter: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),
  employerName: z
    .string()
    .min(2, 'Employer name must be at least 2 characters')
    .max(100, 'Employer name must be 100 characters or less'),
  employerPhone: phoneValidator,
  dateOfEmployment: z
    .string()
    .min(2, 'Date of employment is required')
    .max(50, 'Date must be 50 characters or less'),
  jobTitle: z
    .string()
    .min(2, 'Job title must be at least 2 characters')
    .max(100, 'Job title must be 100 characters or less'),
  wageSalary: z
    .string()
    .min(1, 'Wage/salary is required')
    .max(50, 'Wage/salary must be 50 characters or less'),
  hasSecondJob: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),
  terminated: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),
  accidentType: z
    .string()
    .min(2, 'Accident type must be at least 2 characters')
    .max(200, 'Accident type must be 200 characters or less'),
  howInjuryOccurred: z
    .string()
    .min(10, 'Please provide at least 10 characters describing the injury')
    .max(2000, 'Description must be 2000 characters or less'),
  hospitalizedOvernight: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),

  // ── Employment & Injury (optional) ───────────────────────────────────────
  hoursPerWeek: z
    .string()
    .max(10, 'Must be 10 characters or less')
    .optional()
    .or(z.literal('')),
  returnToWorkDate: z
    .string()
    .max(50, 'Must be 50 characters or less')
    .optional()
    .or(z.literal('')),
  lastDayOfWork: z
    .string()
    .max(50, 'Must be 50 characters or less')
    .optional()
    .or(z.literal('')),
  reportDate: z
    .string()
    .max(50, 'Must be 50 characters or less')
    .optional()
    .or(z.literal('')),
  consultedAttorney: z
    .enum(['yes', 'no', ''])
    .optional(),
  accidentDate: z
    .string()
    .max(50, 'Must be 50 characters or less')
    .optional()
    .or(z.literal('')),
  endingDateOfIllness: z
    .string()
    .max(50, 'Must be 50 characters or less')
    .optional()
    .or(z.literal('')),
  injuryLocation: z
    .enum(['at-work', 'elsewhere', ''])
    .optional(),
  elsewhereDescription: z
    .string()
    .max(200, 'Must be 200 characters or less')
    .optional()
    .or(z.literal('')),
  timeOfInjury: z
    .string()
    .max(50, 'Must be 50 characters or less')
    .optional()
    .or(z.literal('')),
  partsOfBodyInjured: z
    .string()
    .max(200, 'Must be 200 characters or less')
    .optional()
    .or(z.literal('')),
  responsibleParties: z
    .array(
      z.enum([
        'employer',
        'co-employee',
        'someone-else',
        'unsafe-condition',
        'machine',
        'chemical-substance',
      ]),
    )
    .optional(),
  responsibilityExplanation: z
    .string()
    .max(2000, 'Must be 2000 characters or less')
    .optional()
    .or(z.literal('')),
  currentDoctors: z
    .string()
    .max(500, 'Must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  otherDoctors: z
    .string()
    .max(500, 'Must be 500 characters or less')
    .optional()
    .or(z.literal('')),

  // ── Insurance, Benefits & Medical History (required) ─────────────────────
  wcInsuranceCompany: z
    .string()
    .min(2, 'Insurance company name must be at least 2 characters')
    .max(200, 'Insurance company name must be 200 characters or less'),
  wcInsurancePhone: phoneValidator,
  hasPrivateMedicalInsurance: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),
  datesNotWorked: z
    .string()
    .min(2, 'Please provide the dates you did not work')
    .max(500, 'Must be 500 characters or less'),
  appliedForSocialSecurity: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),
  priorBodyPartInjury: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),
  priorInjuryLocation: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),
  otherJobInjuries: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),
  priorWcClaims: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),
  offJobInjuries: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),
  filedClaimOrLawsuit: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),
  agreementAccepted: z
    .boolean()
    .refine((val) => val === true, { message: 'You must agree to the terms and conditions' }),

  // ── Insurance, Benefits & Medical History (optional) ──────────────────────
  claimsAdjusterName: z
    .string()
    .max(100, 'Must be 100 characters or less')
    .optional()
    .or(z.literal('')),
  claimsAdjusterPhone: optionalPhoneValidator,
  claimNumber: z
    .string()
    .max(50, 'Must be 50 characters or less')
    .optional()
    .or(z.literal('')),
  claimDenied: z.enum(['yes', 'no', '']).optional(),
  whoPayedTreatment: z
    .array(
      z.enum([
        'workers-comp-insurance',
        'private-medical-insurance',
        'medicaid',
        'medicare',
        'yourself',
      ]),
    )
    .optional(),
  unpaidMedicalBills: z
    .string()
    .max(2000, 'Must be 2000 characters or less')
    .optional()
    .or(z.literal('')),
  wcBenefitsDates: z
    .string()
    .max(500, 'Must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  otherBenefits: z
    .string()
    .max(2000, 'Must be 2000 characters or less')
    .optional()
    .or(z.literal('')),
  priorInjuryDoctors: z
    .string()
    .max(500, 'Must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  otherMedicalConditions: z
    .string()
    .max(2000, 'Must be 2000 characters or less')
    .optional()
    .or(z.literal('')),
  otherConditionsDoctors: z
    .string()
    .max(500, 'Must be 500 characters or less')
    .optional()
    .or(z.literal('')),
})

export type CaseQuestionnaireData = z.infer<typeof caseQuestionnaireSchema>

export const caseQuestionnaireEmailSchema = caseQuestionnaireSchema.extend({
  submissionId: z.coerce.string().optional(),
})
