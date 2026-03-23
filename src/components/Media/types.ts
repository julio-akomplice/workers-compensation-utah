import type { StaticImageData } from 'next/image'
import type { ElementType, Ref } from 'react'

import type { Media as MediaType } from '@/payload-types'

interface SharedProps {
  alt?: string
  className?: string
  htmlElement?: ElementType | null
  onClick?: () => void
  onLoad?: () => void
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
  resource?: MediaType | string | number | null
  src?: StaticImageData
}

interface ImageProps extends SharedProps {
  blurDataURL?: string
  fill?: boolean
  imgClassName?: string
  loading?: 'lazy' | 'eager'
  pictureClassName?: string
  placeholder?: 'blur' | 'empty' | `data:image/${string}`
  priority?: boolean
  quality?: number
  size?: string
  sizes?: string
  unoptimized?: boolean
}

interface VideoProps extends SharedProps {
  autoPlay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  playsInline?: boolean
  videoClassName?: string
}

export type Props = ImageProps & VideoProps
