import React from 'react'

import type { PhoneButtonBlock as PhoneButtonBlockProps } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
} & PhoneButtonBlockProps

export const PhoneButtonBlockComponent: React.FC<Props> = ({ className, label }) => {
  if (!label) return null

  return (
    <div className={cn('my-8', className)}>
      <a href="tel:8014249675" className="no-underline">
        <Button variant="gradient" size="lg" className="text-white">
          <Phone className="w-5 h-5 shrink-0" fill="currentColor" strokeWidth={0} />
          {label}
        </Button>
      </a>
    </div>
  )
}
