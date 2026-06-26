import React from 'react'

import type { LandingPageWhyUsSectionBlock as LandingPageWhyUsSectionBlockProps } from 'src/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & LandingPageWhyUsSectionBlockProps

export const LandingPageWhyUsSectionBlock: React.FC<Props> = ({
  sectionHeader,
  backgroundImage,
  mobileBackgroundImage,
  items,
}) => {
  return (
    <section className="relative w-full overflow-hidden py-25 md:py-30">
      {/* Background image + overlay */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {mobileBackgroundImage && (
          <div className="absolute inset-0 md:hidden">
            <Media resource={mobileBackgroundImage} imgClassName="w-full h-full object-cover" />
          </div>
        )}
        <div className={`absolute inset-0 ${mobileBackgroundImage ? 'hidden md:block' : ''}`}>
          <Media resource={backgroundImage} imgClassName="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-deep-blue-1000/85" />
      </div>

      <div className="container relative z-10 mx-auto px-5 md:px-8 lg:px-4">
        {/* Section Header */}
        {sectionHeader && 'root' in sectionHeader && (
          <div className="section-header section-header--dark mb-10 text-center md:mb-15">
            <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
          </div>
        )}

        {/* Items Grid */}
        {items && items.length > 0 && (
          <div className="mx-auto grid max-w-304 grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3 md:gap-y-12.5">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col">
                <div className="mb-3.75 size-11">
                  <Media
                    resource={item.icon}
                    imgClassName="size-full object-contain [&_svg]:size-full [&_svg]:object-contain"
                  />
                </div>
                <h3 className="mb-2.5 text-2xl font-medium leading-7 tracking-[-0.72px] text-white">
                  {item.title}
                </h3>
                <p className="max-w-82.5 text-base leading-6 tracking-[-0.32px] text-navy-200">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
