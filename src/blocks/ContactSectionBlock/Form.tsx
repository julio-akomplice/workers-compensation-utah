'use client'

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import type { Form as FormType } from '@/payload-types'
import RichText from '@/components/RichText'
import { getClientSideURL } from '@/utilities/getURL'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormLabel } from '@/components/ui/FormLabel'
import { FormError } from '@/components/ui/FormError'
import { ButtonArrow } from '@/components/ui/ButtonArrow'

type Props = {
  form: FormType
}

export const ContactForm: React.FC<Props> = ({ form }) => {
  const {
    id: formID,
    fields: formFields,
    submitButtonLabel,
    confirmationType,
    confirmationMessage,
    redirect,
  } = form

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Record<string, string>) => {
      const submitForm = async () => {
        setError(undefined)
        setIsLoading(true)

        const dataToSend = Object.entries(data).map(([field, value]) => ({
          field,
          value,
        }))

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })

          const res = await req.json()

          if (req.status >= 400) {
            setIsLoading(false)
            setError(res.errors?.[0]?.message || 'Something went wrong.')
            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

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
    [formID, confirmationType, redirect, router],
  )

  if (hasSubmitted && confirmationType === 'message' && confirmationMessage) {
    return <RichText data={confirmationMessage} enableGutter={false} />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-4">
        {formFields?.map((field, index) => {
          if (field.blockType === 'message') {
            return field.message ? (
              <div key={index} className="md:col-span-full">
                <RichText data={field.message} enableGutter={false} enableProse={false} />
              </div>
            ) : null
          }

          const name = 'name' in field ? field.name : field.blockType
          const label = 'label' in field ? field.label : undefined
          const placeholder = 'placeholder' in field ? (field.placeholder ?? '') : ''
          const required = 'required' in field ? (field.required ?? false) : false
          const width = 'width' in field ? field.width : undefined
          const isFullWidth =
            field.blockType === 'textarea' || (width !== undefined && width === 100)

          return (
            <div key={index} className={isFullWidth ? 'md:col-span-full' : ''}>
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
                  {...register(name, { required })}
                />
              ) : field.blockType === 'email' ? (
                <Input
                  id={name}
                  type="email"
                  placeholder={placeholder}
                  {...register(name, {
                    required,
                    pattern: /^\S[^\s@]*@\S+$/,
                  })}
                />
              ) : field.blockType === 'number' ? (
                <Input
                  id={name}
                  type="number"
                  placeholder={placeholder}
                  {...register(name, { required })}
                />
              ) : field.blockType === 'select' && 'options' in field ? (
                <select
                  id={name}
                  className="w-full rounded-[6px] border border-navy-50 bg-off-white md:bg-light-gray px-3 py-4 text-body text-dark-blue placeholder:text-navy-200 outline-none transition-colors focus:border-orange focus:ring-1 focus:ring-orange"
                  {...register(name, { required })}
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
                    {...register(name, { required })}
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
                  {...register(name, { required })}
                />
              )}

              {errors[name] && <FormError>This field is required</FormError>}
            </div>
          )
        })}
      </div>

      {error && <FormError className="mt-4 text-sm">{error}</FormError>}

      <ButtonArrow type="submit" disabled={isLoading} className="mt-3 w-full md:h-[54px]">
        {isLoading ? 'Submitting...' : submitButtonLabel || 'Submit'}
      </ButtonArrow>
    </form>
  )
}
