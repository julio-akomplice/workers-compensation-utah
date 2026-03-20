import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-6 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0",
  {
    variants: {
      variant: {
        gradient: [
          'relative isolate overflow-hidden text-white rounded-[6px]',
          // ::after = blue (bottom layer)
          'after:absolute after:inset-0 after:bg-[#FA681C] after:z-[-2] after:pointer-events-none',
          // ::before = red (top layer, fades out on hover)
          'before:absolute before:inset-0 before:[background:linear-gradient(95deg,#FFB94A_0.83%,#F74A0B)] before:shadow-[inset_0_-3px_7px_0_#FFB94A] before:transition-opacity before:duration-300 before:z-[-1] before:pointer-events-none',
          'hover:before:opacity-0',
        ].join(' '),
      },
      size: {
        default: cn('h-12 px-6 py-3.5'),
      },
    },
    defaultVariants: {
      variant: 'gradient',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button: React.FC<ButtonProps> = ({ asChild = false, className, size, variant, ...props }) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
