import React from 'react'

import type { LandingPageResultsSectionBlock as LandingPageResultsSectionBlockProps } from 'src/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & LandingPageResultsSectionBlockProps

export const LandingPageResultsSectionBlock: React.FC<Props> = ({ sectionHeader, results }) => {
  return (
    <section className="w-full bg-off-white py-20 tablet:py-30">
      <div className="container mx-auto px-5 tablet:px-8 desktop-sm:px-4">
        {/* Section Header */}
        {sectionHeader && 'root' in sectionHeader && (
          <div className="section-header text-center mb-15 mx-auto text-balance">
            <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
          </div>
        )}

        {/* Results Grid */}
        {results && results.length > 0 && (
          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 tablet:gap-6 desktop-sm:grid-cols-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex h-full min-h-[238px] w-full flex-col justify-start rounded-[15px] border-[1.5px] border-light-gray bg-white px-6 py-[30px]"
              >
                <div className="size-[49px] mb-5">
                  <Media
                    resource={result.icon}
                    imgClassName="block size-full object-contain [&>svg]:size-full [&>svg]:object-contain"
                  />
                </div>
                <p className="text-[42px] leading-[46px] font-semibold tracking-[-1.68px] text-dark-blue mb-[15px]">
                  {result.stat}
                </p>
                <p className="text-base leading-6 tracking-[-0.32px] text-deep-blue-800">
                  {result.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
