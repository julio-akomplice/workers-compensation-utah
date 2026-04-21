import React from 'react'

import { cn } from '@/utilities/ui'

import { Button, type ButtonProps } from './button'
import { ArrowIcon } from './ArrowIcon'

export interface ButtonArrowProps extends ButtonProps {}

export const ButtonArrow: React.FC<ButtonArrowProps> = ({ children, className, ...props }) => {
  return (
    <Button className={cn('group', className)} {...props}>
      {children}
      <ArrowIcon className="w-6 h-6 transition-all duration-200 group-hover:translate-x-0.75" />
    </Button>
  )
}
