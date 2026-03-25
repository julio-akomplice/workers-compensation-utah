import React from 'react'

import type { HomeAboutUsBlock as HomeAboutUsBlockProps } from 'src/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & HomeAboutUsBlockProps

export const HomeAboutUsBlock: React.FC<Props> = ({ sectionHeader, image, link }) => {
  return (
    <section className="w-full py-[60px] bg-deep-blue-1000 md:pt-[60px] md:pb-20 lg:py-25">
      <div className="container mx-auto px-5 md:px-8 lg:px-4">
        <div className="grid grid-cols-1 items-stretch gap-10 md:gap-20 lg:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div className="relative h-full order-2 md:order-1">
            <div className="overflow-hidden rounded-[10px] h-full md:rounded-xl">
              <Media resource={image} imgClassName="w-full h-full object-cover" />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col order-1 md:order-2 lg:py-8.25">
            {sectionHeader && 'root' in sectionHeader && (
              <div className="section-header section-header--dark [&_h2]:mb-8.75">
                <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
              </div>
            )}

            {link && (
              <div className="mt-10 flex justify-center md:justify-start">
                <CMSLink {...link} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
