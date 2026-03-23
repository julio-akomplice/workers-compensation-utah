import { cn } from '@/utilities/ui'
import React from 'react'

import type { Props as MediaProps } from '../types'

export const SvgMedia: React.FC<MediaProps> = (props) => {
  const { className, imgClassName, onClick, resource, svgContent } = props

  if (!svgContent) return null

  return (
    <div
      className={cn(className, imgClassName)}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      onClick={onClick}
      role="img"
      aria-label={typeof resource === 'object' && resource?.alt ? resource.alt : undefined}
    />
  )
}
