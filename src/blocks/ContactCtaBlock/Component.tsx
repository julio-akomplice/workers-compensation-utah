import React from 'react'

import type { ContactCtaBlock as ContactCtaBlockProps } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { ArrowIcon } from '@/components/ui/ArrowIcon'

type Props = {
  className?: string
} & ContactCtaBlockProps

export const ContactCtaBlockComponent: React.FC<Props> = ({ className, label }) => {
  if (!label) return null

  return (
    <div className={cn('my-8', className)}>
      <Button variant="gradient" size="lg" className="text-white">
        {label}
        <ArrowIcon />
      </Button>
    </div>
  )
}
