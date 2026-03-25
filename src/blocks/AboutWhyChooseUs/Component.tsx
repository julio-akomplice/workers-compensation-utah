import React from 'react'

import type { AboutWhyChooseUsBlock as AboutWhyChooseUsBlockProps } from 'src/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & AboutWhyChooseUsBlockProps

export const AboutWhyChooseUsBlock: React.FC<Props> = ({
  sectionHeader,
  backgroundImage,
  items,
}) => {
  return (
    <section className="w-full relative overflow-hidden py-[100px] md:py-20 lg:py-25">
      {/* Background image + overlay */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <Media
          resource={backgroundImage}
          imgClassName="w-full h-full object-cover"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-deep-blue-1000/80" />
      </div>

      <div className="container relative z-10 mx-auto px-5 md:px-8 lg:px-4">
        {/* Section Header */}
        {sectionHeader && 'root' in sectionHeader && (
          <div className="section-header section-header--dark text-center mb-15">
            <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
          </div>
        )}

        {/* Items Grid */}
        {items && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="border-l-[1.5px] border-navy-500 py-7 pl-[30px] pr-4"
              >
                <div className="size-10 mb-[15px]">
                  <Media
                    resource={item.icon}
                    imgClassName="w-full h-full object-contain"
                  />
                </div>
                <h5 className="text-white font-medium text-2xl leading-7 tracking-[-0.72px] mb-2.5">
                  {item.title}
                </h5>
                <p className="text-navy-200 text-base leading-6 tracking-[-0.32px]">
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
