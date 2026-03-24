import React, { Fragment } from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { SvgMedia } from './SvgMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement, resource } = props

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const isSVG = typeof resource === 'object' && resource?.mimeType?.includes('svg')
  const Tag = htmlElement || Fragment

  if (isSVG) {
    const svgContent =
      typeof resource === 'object' && resource?.svgContent ? resource.svgContent : null
    return <SvgMedia {...props} svgContent={svgContent} />
  }

  return (
    <Tag
      {...(htmlElement
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
    </Tag>
  )
}
