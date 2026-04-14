import * as React from 'react'

import { cn } from '@/utilities/ui'

const formatUSPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

type PhoneInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = formatUSPhone(e.target.value)
      onChange?.(e)
    }

    return (
      <input
        ref={ref}
        type="tel"
        inputMode="numeric"
        className={cn(
          'w-full rounded-[6px] border border-navy-50 bg-off-white md:bg-light-gray px-3 py-4 text-body text-dark-blue placeholder:text-navy-200 outline-none transition-colors focus:border-orange focus:ring-1 focus:ring-orange',
          className,
        )}
        onChange={handleChange}
        {...props}
      />
    )
  },
)

PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }
