'use client'

import React from 'react'

export type TextInputProps = {
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

export const TextInput: React.FC<TextInputProps> = ({
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
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full h-14 rounded-md border px-3 text-body tracking-[-0.32px] text-off-black outline-none focus:border-navy-200 transition-colors ${color === 'gray' ? 'bg-light-gray' : 'bg-white'} ${error ? 'border-red-500' : 'border-navy-50'}`}
      />
      {error && (
        <p className="text-red-500 text-[13px] mt-1">{errorMessage ?? 'This field is required'}</p>
      )}
    </div>
  )
}
