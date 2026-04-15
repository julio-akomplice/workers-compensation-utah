import React from 'react'

import type { AboutOurAttorneyBlock as AboutOurAttorneyBlockProps } from 'src/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & AboutOurAttorneyBlockProps

export const AboutOurAttorneyBlock: React.FC<Props> = ({ content, image, link }) => {
  return (
    <section className="w-full bg-white py-[60px] md:py-[60px] lg:py-[100px]">
      <div className="container flex flex-col lg:flex-row lg:items-center lg:gap-[110px] md:px-8 lg:px-[130px]">
        {/* Image */}
        <div className="w-full lg:w-[543px] lg:shrink-0">
          <div className="aspect-[65/92] overflow-hidden md:aspect-auto md:rounded-[10px] md:h-[556px] lg:h-[586px]">
            <Media resource={image} imgClassName="w-full h-full object-cover" />
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pt-[60px] md:px-0 lg:flex-1 lg:pt-0">
          {content && 'root' in content && (
            <div className="about-attorney-content">
              <RichText data={content} enableGutter={false} enableProse={false} />
            </div>
          )}

          {link && (
            <div className="mt-10">
              <CMSLink {...link} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
