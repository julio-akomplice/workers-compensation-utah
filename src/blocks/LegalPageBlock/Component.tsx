import React from 'react'

import type { LegalPageBlock as LegalPageBlockProps } from 'src/payload-types'

import RichText from '@/components/RichText'

type Props = {
  className?: string
} & LegalPageBlockProps

export const LegalPageBlockComponent: React.FC<Props> = ({ title, content }) => {
  return (
    <section className="w-full bg-white pb-15 pt-10 md:pb-20 md:pt-15 lg:pb-25 lg:pt-15">
      <div className="container mx-auto max-w-87.5 px-5 md:max-w-192.5 md:px-0 lg:max-w-227">
        <h1 className="text-[40px] font-semibold leading-[44px] tracking-[-1.6px] text-dark-blue md:text-[50px] md:leading-[55px] md:tracking-[-2px]">
          {title}
        </h1>
        {content && 'root' in content && (
          <div className="richtext mt-8.75 md:mt-[35px]">
            <RichText data={content} enableGutter={false} enableProse={false} />
          </div>
        )}
      </div>
    </section>
  )
}
