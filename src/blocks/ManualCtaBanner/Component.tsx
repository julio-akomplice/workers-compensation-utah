import React from 'react'
import type { ManualCtaBannerBlock as ManualCtaBannerBlockProps } from '@/payload-types'
import { CtaBannerDisplay } from '@/components/CtaBannerDisplay'

type Props = {
  className?: string
} & ManualCtaBannerBlockProps

export const ManualCtaBannerBlockComponent: React.FC<Props> = ({ className, content }) => {
  return <CtaBannerDisplay data={content} className={className} />
}
