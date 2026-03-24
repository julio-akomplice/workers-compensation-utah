'use client'

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import type { Form as FormType } from '@/payload-types'
import RichText from '@/components/RichText'
import { getClientSideURL } from '@/utilities/getURL'
import { Button } from '@/components/ui/button'
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {formFields?.map((field, index) => {
          if (field.blockType === 'message') {
            return field.message ? (
              <div key={index} className="col-span-full">
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

          const inputClassName =
            'w-full rounded-[6px] border border-navy-50 bg-light-gray px-3 py-4 text-body text-dark-blue placeholder:text-navy-200 outline-none transition-colors focus:border-orange focus:ring-1 focus:ring-orange'

          return (
            <div key={index} className={isFullWidth ? 'col-span-full' : ''}>
              {label && (
                <label
                  htmlFor={name}
                  className="mb-1.5 block text-body-sm font-normal text-navy-500 -tracking-[0.02em]"
                >
                  {label}
                  {required && <span className="text-orange">*</span>}
                </label>
              )}

              {field.blockType === 'textarea' ? (
                <textarea
                  id={name}
                  placeholder={placeholder}
                  rows={4}
                  className={inputClassName}
                  {...register(name, { required })}
                />
              ) : field.blockType === 'email' ? (
                <input
                  id={name}
                  type="email"
                  placeholder={placeholder}
                  className={inputClassName}
                  {...register(name, {
                    required,
                    pattern: /^\S[^\s@]*@\S+$/,
                  })}
                />
              ) : field.blockType === 'number' ? (
                <input
                  id={name}
                  type="number"
                  placeholder={placeholder}
                  className={inputClassName}
                  {...register(name, { required })}
                />
              ) : field.blockType === 'select' && 'options' in field ? (
                <select id={name} className={inputClassName} {...register(name, { required })}>
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
                    <label htmlFor={name} className="text-sm text-deep-blue-1000">
                      {label}
                    </label>
                  )}
                </div>
              ) : (
                <input
                  id={name}
                  type="text"
                  placeholder={placeholder}
                  className={inputClassName}
                  {...register(name, { required })}
                />
              )}

              {errors[name] && <p className="mt-1 text-xs text-red-500">This field is required</p>}
            </div>
          )
        })}
      </div>

      <p className="mt-1 text-body-sm text-navy-500 text-center -tracking-[0.02em]">
        All fields are required.
      </p>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <ButtonArrow type="submit" disabled={isLoading} className="mt-3 w-full">
        {isLoading ? 'Submitting...' : submitButtonLabel || 'Submit'}
      </ButtonArrow>
    </form>
  )
}
