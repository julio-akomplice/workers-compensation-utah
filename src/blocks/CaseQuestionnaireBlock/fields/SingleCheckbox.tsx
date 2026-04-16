'use client'

import React from 'react'

export type SingleCheckboxProps = {
  label: string
  name: string
  checked: boolean
  onChange: (checked: boolean) => void
  error?: boolean
  errorMessage?: string
}

export const SingleCheckbox: React.FC<SingleCheckboxProps> = ({
  label,
  name,
  checked,
  onChange,
  error,
  errorMessage,
}) => {
  return (
    <div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span
          className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center shrink-0 ${
            checked ? 'border-navy-800 bg-navy-800' : error ? 'border-red-500' : 'border-navy-200'
          }`}
        >
          {checked && (
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
        <span className="text-body tracking-[-0.32px] text-deep-blue-900">{label}</span>
      </label>
      {error && (
        <p className="text-red-500 text-[13px] mt-1">{errorMessage ?? 'This field is required'}</p>
      )}
    </div>
  )
}
