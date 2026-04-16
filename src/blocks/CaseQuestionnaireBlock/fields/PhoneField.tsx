'use client'

import React from 'react'
import { PhoneInput } from '@/components/ui/PhoneInput'

export type PhoneFieldProps = {
  label: string
  required?: boolean
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  fullWidth?: boolean
  error?: boolean
  errorMessage?: string
  color?: 'white' | 'gray'
}

export const PhoneField: React.FC<PhoneFieldProps> = ({
  label,
  required,
  name,
  value,
  onChange,
  fullWidth,
  error,
  errorMessage,
  color = 'white',
}) => {
  return (
    <div className={fullWidth ? 'w-full' : 'w-full md:w-[calc(50%-10px)]'}>
      <label className="block text-body tracking-[-0.32px] text-off-black mb-1.5">
        {label}
        {required && <span className="text-orange">*</span>}
      </label>
      <PhoneInput
        name={name}
        value={value}
        onChange={onChange}
        maxLength={14}
        color={color}
        className={`h-14 py-0 tracking-[-0.32px] text-off-black ${error ? 'border-red-500' : 'border-navy-50'}`}
      />
      {error && (
        <p className="text-red-500 text-[13px] mt-1">{errorMessage ?? 'This field is required'}</p>
      )}
    </div>
  )
}
