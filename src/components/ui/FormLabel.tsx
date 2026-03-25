import React from 'react'

import { cn } from '@/utilities/ui'

type FormLabelProps = {
  htmlFor?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}

export const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  required,
  className,
  children,
}) => (
  <label
    htmlFor={htmlFor}
    className={cn('mb-1.5 block text-body-sm font-normal text-navy-500 -tracking-[0.02em]', className)}
  >
    {children}
    {required && <span className="text-orange">*</span>}
  </label>
)
