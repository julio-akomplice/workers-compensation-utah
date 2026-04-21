import React from 'react'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'

type Props = {
  className?: string
  data: any
}

export const CtaBannerDisplay: React.FC<Props> = ({ className, data }) => {
  if (!data) return null

  return (
    <div className={cn('stop-a mx-auto my-8 w-full', className)}>
      <div className="rounded-[10px] bg-gradient-to-r from-[#001f3e] to-[#00152b] px-5 py-5 text-center">
        <RichText
          data={data}
          enableGutter={false}
          enableProse={false}
          className="cta-banner-richtext [&_p]:text-[24px] [&_p]:font-medium [&_p]:leading-7 [&_p]:tracking-[-0.72px] [&_p]:text-white [&_a]:text-[#ffb94a] [&_a]:hover:text-[#ffc96e] [&_a]:hover:underline"
        />
      </div>
    </div>
  )
}
