'use client'

import React from 'react'

export type TextAreaProps = {
  label: string
  required?: boolean
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  error?: boolean
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  required,
  name,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="w-full">
      <label className="block text-body tracking-[-0.32px] text-off-black mb-1.5">
        {label}
        {required && <span className="text-orange">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full h-[124px] rounded-[6px] border bg-white px-3 py-4 text-body tracking-[-0.32px] text-off-black outline-none focus:border-navy-200 transition-colors resize-none ${error ? 'border-red-500' : 'border-navy-50'}`}
      />
      {error && (
        <p className="text-red-500 text-[13px] mt-1">This field is required</p>
      )}
    </div>
  )
}
