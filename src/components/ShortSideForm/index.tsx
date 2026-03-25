'use client'

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import type { Form as FormType, ShortSideForm as ShortSideFormType } from '@/payload-types'
import RichText from '@/components/RichText'
import { getClientSideURL } from '@/utilities/getURL'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormLabel } from '@/components/ui/FormLabel'
import { FormError } from '@/components/ui/FormError'
import { ButtonArrow } from '@/components/ui/ButtonArrow'

type Props = {
  form: FormType
  header?: ShortSideFormType['header']
}

export const ShortSideForm: React.FC<Props> = ({ form, header }) => {
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
    return (
      <div className="rounded-[15px] bg-deep-blue-1000 p-6">
        <RichText data={confirmationMessage} enableGutter={false} />
      </div>
    )
  }

  return (
    <div className="rounded-[15px] bg-deep-blue-1000 p-6 overflow-hidden">
      {header && 'root' in header && (
        <div className="mb-4 text-center short-side-form-header">
          <RichText data={header} enableGutter={false} enableProse={false} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          {formFields?.map((field, index) => {
            if (field.blockType === 'message') {
              return field.message ? (
                <div key={index}>
                  <RichText data={field.message} enableGutter={false} enableProse={false} />
                </div>
              ) : null
            }

            const name = 'name' in field ? field.name : field.blockType
            const label = 'label' in field ? field.label : undefined
            const placeholder = 'placeholder' in field ? (field.placeholder ?? '') : ''
            const required = 'required' in field ? (field.required ?? false) : false

            return (
              <div key={index}>
                {label && field.blockType !== 'checkbox' && (
                  <FormLabel htmlFor={name} required={required} className="text-navy-100">
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

        <ButtonArrow type="submit" disabled={isLoading} className="mt-5 w-full md:h-[54px]">
          {isLoading ? 'Submitting...' : submitButtonLabel || 'Send Request'}
        </ButtonArrow>
      </form>
    </div>
  )
}
