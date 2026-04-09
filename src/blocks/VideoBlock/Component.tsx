'use client'

import React from 'react'

import type { VideoBlock as VideoBlockProps, Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

type Props = VideoBlockProps & {
  className?: string
}

export const VideoBlockComponent: React.FC<Props> = ({
  video,
  poster,
  autoplay,
  muted,
  loop,
  controls,
  playsInline,
  className,
}) => {
  const videoResource = typeof video === 'object' ? video : null
  const posterResource = typeof poster === 'object' ? (poster as Media) : null

  if (!videoResource?.url) return null

  const videoSrc = getMediaUrl(videoResource.url)
  const posterSrc = posterResource?.url ? getMediaUrl(posterResource.url) : undefined

  return (
    <div className={className}>
      <video
        autoPlay={autoplay ?? false}
        controls={controls ?? true}
        loop={loop ?? false}
        muted={muted ?? true}
        playsInline={playsInline ?? true}
        poster={posterSrc}
        className="w-full rounded-[10px]"
      >
        <source src={videoSrc} type={videoResource.mimeType || 'video/mp4'} />
      </video>
    </div>
  )
}
