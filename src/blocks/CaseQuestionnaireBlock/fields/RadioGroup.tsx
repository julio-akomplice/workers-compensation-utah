'use client'

import React from 'react'

export type RadioGroupProps = {
  label: string
  required?: boolean
  name: string
  options: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
  fullWidth?: boolean
  error?: boolean
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  required,
  name,
  options,
  value,
  onChange,
  fullWidth,
  error,
}) => {
  return (
    <div className={fullWidth ? 'w-full' : 'w-full md:w-[calc(50%-10px)]'} data-field={name}>
      <label className="block text-body tracking-[-0.32px] text-off-black mb-1.5">
        {label}
        {required && <span className="text-orange">*</span>}
      </label>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                value === option.value ? 'border-navy-800' : error ? 'border-red-500' : 'border-navy-200'
              }`}
            >
              {value === option.value && (
                <span className="w-2.5 h-2.5 rounded-full bg-navy-800" />
              )}
            </span>
            <span className="text-body tracking-[-0.32px] text-deep-blue-900">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-[13px] mt-1">Please select an option</p>
      )}
    </div>
  )
}
