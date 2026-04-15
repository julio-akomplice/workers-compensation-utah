'use client'

import { cn } from '@/utilities/ui'
import React, { useId } from 'react'

import type { Props as MediaProps } from '../types'

export const SvgMedia: React.FC<MediaProps> = (props) => {
  const { className, imgClassName, onClick, resource, svgContent } = props
  const uid = useId().replace(/:/g, '')

  if (!svgContent) return null

  const scopedSvg = svgContent
    .replace(/\bid="([^"]+)"/g, (_, id) => `id="${uid}${id}"`)
    .replace(/\burl\(#([^)]+)\)/g, (_, id) => `url(#${uid}${id})`)

  return (
    <div
      className={cn(className, imgClassName)}
      dangerouslySetInnerHTML={{ __html: scopedSvg }}
      onClick={onClick}
      role="img"
      aria-label={typeof resource === 'object' && resource?.alt ? resource.alt : undefined}
    />
  )
}
