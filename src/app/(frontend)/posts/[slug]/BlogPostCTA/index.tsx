import React from 'react'

import type { Template } from '@/payload-types'
import { CMSLink } from '@/components/Link'

type Props = {
  data?: Template['blogPost']
}

export const BlogPostCTA: React.FC<Props> = ({ data }) => {
  const link = data?.link
  if (!link?.label) return null

  return (
    <CMSLink
      {...link}
      appearance="gradient"
      size="default"
      className="mt-10 self-start text-[18px] font-medium tracking-[-0.36px]"
    />
  )
}
