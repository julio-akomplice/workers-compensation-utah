import { z } from 'zod'
import type { Form as FormType } from '@/payload-types'

type FormField = NonNullable<FormType['fields']>[number]

export function buildFormSchema(fields: FormType['fields']): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const field of fields ?? []) {
    if (!('name' in field)) continue

    const label = ('label' in field && field.label) ? field.label : field.name
    const required = 'required' in field ? (field.required ?? false) : false

    let validator: z.ZodTypeAny

    if (field.blockType === 'email') {
      validator = z.string().email('Please enter a valid email address').max(254, 'Email must be 254 characters or less')
      if (!required) validator = validator.or(z.literal('')).optional()
    } else if (field.blockType === 'number' && field.name.toLowerCase().includes('phone')) {
      const phoneValidator = z
        .string()
        .refine(
          (val) => {
            const digits = val.replace(/\D/g, '')
            return digits.length === 10 && !/^[01]/.test(digits)
          },
          'Please enter a valid 10-digit US phone number',
        )
      validator = required ? phoneValidator : phoneValidator.or(z.literal('')).optional()
    } else if (field.blockType === 'number') {
      validator = z.string().regex(/^\d+$/, 'Please enter a valid number')
      if (!required) validator = validator.or(z.literal('')).optional()
    } else if (field.blockType === 'checkbox') {
      validator = required ? z.boolean().refine((v) => v === true, `${label} is required`) : z.boolean().optional()
    } else if (field.blockType === 'textarea') {
      validator = z.string().min(required ? 10 : 0, `${label} must be at least 10 characters`).max(1000, `${label} must be 1000 characters or less`)
      if (!required) validator = validator.or(z.literal('')).optional()
    } else {
      validator = required
        ? z.string().min(2, `${label} must be at least 2 characters`).max(100, `${label} must be 100 characters or less`)
        : z.string().max(100, `${label} must be 100 characters or less`).optional()
    }

    shape[field.name] = validator
  }

  return z.object(shape)
}

export const sendFormEmailSchema = z.object({
  submissionData: z.array(
    z.object({
      field: z.string(),
      value: z.string(),
    }),
  ).min(1, 'No submission data provided'),
  labelMap: z.record(z.string()).optional(),
  submissionId: z.coerce.string().optional(),
  sourceUrl: z.string().url().optional(),
})
