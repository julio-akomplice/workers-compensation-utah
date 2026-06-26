'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { Form as FormType } from '@/payload-types'
import { buildFormSchema } from '@/utilities/buildFormSchema'
import { getClientSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { FormLabel } from '@/components/ui/FormLabel'
import { FormError } from '@/components/ui/FormError'
import { ArrowIcon } from '@/components/ui/ArrowIcon'
import { CancelIcon } from '@/components/ui/icons/CancelIcon'
import { CheckCircleIcon } from '@/components/ui/icons/CheckCircleIcon'

const inputClassName = 'bg-off-white'

type Props = {
  form: FormType
}

export const LandingHeroForm: React.FC<Props> = ({ form }) => {
  const {
    id: formID,
    fields: formFields,
    submitButtonLabel,
    confirmationType,
    redirect,
  } = form

  const schema = useMemo(() => buildFormSchema(formFields), [formFields])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Record<string, string>) => {
      const submitForm = async () => {
        setError(undefined)
        setIsLoading(true)

        const sourceUrl = window.location.href

        const dataToSend = [
          ...Object.entries(data).map(([field, value]) => ({ field, value })),
          { field: 'sourceUrl', value: sourceUrl },
        ]

        const labelMap = Object.fromEntries(
          (formFields ?? [])
            .filter((f): f is Extract<typeof f, { name: string }> => 'name' in f && 'label' in f)
            .map((f) => [f.name, (f as { name: string; label?: string }).label ?? f.name]),
        )

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({ form: formID, submissionData: dataToSend }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })

          const res = await req.json()

          if (req.status >= 400) {
            setIsLoading(false)
            setError(res.errors?.[0]?.message || 'Something went wrong.')
            return
          }

          await fetch(`${getClientSideURL()}/api/send-form-email`, {
            body: JSON.stringify({
              submissionData: dataToSend,
              labelMap,
              submissionId: res.doc?.id != null ? String(res.doc.id) : undefined,
              sourceUrl,
            }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })

          setIsLoading(false)
          setHasSubmitted(true)
          reset()

          if (confirmationType === 'redirect' && redirect?.url) {
            router.push(redirect.url)
          }
        } catch {
          setIsLoading(false)
          setError('Something went wrong.')
        }
      }

      void submitForm()
    },
    [formID, formFields, confirmationType, redirect, router, reset],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      {formFields?.map((field, index) => {
        if (field.blockType === 'message') {
          return field.message ? (
            <div key={index}>
              <RichText data={field.message} enableGutter={false} enableProse={false} />
            </div>
          ) : null
        }

        const name = field.name
        const label = field.label ?? undefined
        const placeholder = 'placeholder' in field ? (field.placeholder ?? '') : ''
        const required = field.required ?? false

        return (
          <div key={index}>
            {label && field.blockType !== 'checkbox' && (
              <FormLabel htmlFor={name} required={required}>
                {label}
              </FormLabel>
            )}

            {field.blockType === 'textarea' ? (
              <Textarea
                id={name}
                placeholder={placeholder}
                rows={4}
                minLength={10}
                maxLength={1000}
                className={inputClassName}
                {...register(name)}
              />
            ) : field.blockType === 'email' ? (
              <Input
                id={name}
                type="email"
                placeholder={placeholder}
                maxLength={254}
                className={inputClassName}
                {...register(name)}
              />
            ) : (field.blockType === 'number' || field.blockType === 'text') &&
              name.toLowerCase().includes('phone') ? (
              <PhoneInput
                id={name}
                placeholder={placeholder}
                maxLength={14}
                className={inputClassName}
                {...register(name)}
              />
            ) : field.blockType === 'number' ? (
              <Input
                id={name}
                type="number"
                placeholder={placeholder}
                className={inputClassName}
                {...register(name)}
              />
            ) : field.blockType === 'select' && 'options' in field ? (
              <select
                id={name}
                className="w-full rounded-md border border-navy-50 bg-off-white px-3 py-4 text-body text-dark-blue placeholder:text-navy-200 outline-none transition-colors focus:border-orange focus:ring-1 focus:ring-orange"
                {...register(name)}
              >
                {placeholder && <option value="">{placeholder}</option>}
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.blockType === 'checkbox' ? (
              <div className="flex items-center gap-2">
                <input
                  id={name}
                  type="checkbox"
                  defaultChecked={'defaultValue' in field ? (field.defaultValue ?? false) : false}
                  {...register(name)}
                />
                {label && (
                  <FormLabel htmlFor={name} className="mb-0 text-sm text-deep-blue-1000">
                    {label}
                  </FormLabel>
                )}
              </div>
            ) : (
              <Input
                id={name}
                type="text"
                placeholder={placeholder}
                minLength={2}
                maxLength={100}
                className={inputClassName}
                {...register(name)}
              />
            )}

            {errors[name] && <FormError>{errors[name]?.message as string}</FormError>}
          </div>
        )
      })}

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'group mt-1 flex h-12 w-full items-center justify-center gap-1 rounded-md bg-gradient-brand text-cta-secondary text-white',
          'shadow-[inset_0px_-3px_7px_0px_#ffb94a] transition-opacity hover:opacity-95 disabled:opacity-70 desktop:h-[54px]',
        )}
      >
        {isLoading ? 'Submitting...' : submitButtonLabel || 'Get My Free Consultation'}
        <ArrowIcon className="h-6 w-6 transition-all duration-200 group-hover:translate-x-0.75" />
      </button>

      {error && (
        <div className="flex items-center gap-1.5">
          <CancelIcon className="shrink-0" />
          <p className="text-base tracking-[-0.32px] text-[#FF3C3C]">{error}</p>
        </div>
      )}

      {hasSubmitted && !error && (
        <div className="flex items-center gap-1.5">
          <CheckCircleIcon className="shrink-0" />
          <p className="text-base tracking-[-0.32px] text-[#32C62F]">
            Your consultation request has been submitted. We&apos;ll be in touch soon!
          </p>
        </div>
      )}
    </form>
  )
}
