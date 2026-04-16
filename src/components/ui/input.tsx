import { cn } from '@/utilities/ui'
import * as React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  color?: 'white' | 'gray'
}

const Input: React.FC<InputProps> = ({
  className,
  type,
  color = 'white',
  ...props
}) => {
  return (
    <input
      className={cn(
        'w-full rounded-md border border-navy-50 px-3 py-4 text-body text-dark-blue placeholder:text-navy-200 outline-none transition-colors focus:border-orange focus:ring-1 focus:ring-orange',
        color === 'gray' ? 'bg-light-gray' : 'bg-white',
        className,
      )}
      type={type}
      {...props}
    />
  )
}

export { Input }
