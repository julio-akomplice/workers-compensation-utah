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
    <section className="w-full py-25 bg-deep-blue-1000 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Left Column: Image */}
          <div className="relative h-full">
            <div className="overflow-hidden rounded-xl h-full">
              <Media resource={image} imgClassName="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex flex-col py-8.25">
            {sectionHeader && 'root' in sectionHeader && (
              <div className="section-header section-header--dark [&_h2]:mb-8.75">
                <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
              </div>
            )}

            {link && (
              <div className="mt-14">
                <CMSLink {...link} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
