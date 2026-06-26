import React from 'react'

import type { LandingPageAboutAttorneySectionBlock as LandingPageAboutAttorneySectionBlockProps } from 'src/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
} & LandingPageAboutAttorneySectionBlockProps

export const LandingPageAboutAttorneySectionBlock: React.FC<Props> = ({ content, image }) => {
  return (
    <section className={cn('w-full bg-off-white md:bg-white')}>
      <div className={cn('container mx-auto md:py-25 xl:py-30')}>
        <div className={cn('flex flex-col md:flex-row md:items-center md:gap-10 xl:gap-50')}>
          {/* Image */}
          <div className={cn('order-1 -mx-5 md:order-2 md:mx-0 md:shrink-0')}>
            <div
              className={cn(
                'aspect-390/552 w-full overflow-hidden md:aspect-auto md:h-130 md:w-81.5 md:rounded-xl xl:h-147.5 xl:w-135.75',
              )}
            >
              <Media resource={image} imgClassName="w-full h-full object-cover" priority />
            </div>
          </div>

          {/* Content */}
          <div className={cn('order-2 pb-15 pt-15 md:order-1 md:flex-1 md:py-0')}>
            {content && 'root' in content && (
              <div className={cn('about-attorney-content')}>
                <RichText data={content} enableGutter={false} enableProse={false} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
