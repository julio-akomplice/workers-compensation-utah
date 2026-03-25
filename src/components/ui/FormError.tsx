import React from 'react'

import { cn } from '@/utilities/ui'

type FormErrorProps = {
  className?: string
  children: React.ReactNode
}

export const FormError: React.FC<FormErrorProps> = ({ className, children }) => (
  <p className={cn('mt-1 text-xs text-red-500', className)}>{children}</p>
)
