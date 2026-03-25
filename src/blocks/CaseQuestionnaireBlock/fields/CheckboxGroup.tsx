'use client'

import React from 'react'

export type CheckboxGroupProps = {
  label: string
  options: { label: string; value: string }[]
  values: string[]
  onChange: (values: string[]) => void
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  values,
  onChange,
}) => {
  const handleToggle = (optionValue: string) => {
    if (values.includes(optionValue)) {
      onChange(values.filter((v) => v !== optionValue))
    } else {
      onChange([...values, optionValue])
    }
  }

  return (
    <div className="w-full">
      <label className="block text-body tracking-[-0.32px] text-off-black mb-1.5">
        {label}
      </label>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <input
              type="checkbox"
              value={option.value}
              checked={values.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="sr-only"
            />
            <span
              className={`w-6 h-6 rounded-[4px] border-2 flex items-center justify-center shrink-0 ${
                values.includes(option.value)
                  ? 'border-navy-800 bg-navy-800'
                  : 'border-navy-200'
              }`}
            >
              {values.includes(option.value) && (
                <svg
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5L5 9L13 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="text-body tracking-[-0.32px] text-deep-blue-900">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
