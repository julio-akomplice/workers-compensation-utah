import { cn } from '@/utilities/ui'
import * as React from 'react'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  color?: 'white' | 'gray'
}

const Textarea: React.FC<TextareaProps> = ({
  className,
  color = 'white',
  ...props
}) => {
  return (
    <textarea
      className={cn(
        'w-full rounded-md border border-navy-50 px-3 py-4 text-body text-dark-blue placeholder:text-navy-200 outline-none transition-colors focus:border-orange focus:ring-1 focus:ring-orange',
        color === 'gray' ? 'bg-light-gray' : 'bg-white',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
