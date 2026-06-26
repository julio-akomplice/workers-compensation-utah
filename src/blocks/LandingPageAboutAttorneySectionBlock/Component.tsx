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
    <section className={cn('w-full bg-off-white tablet:bg-white')}>
      <div className={cn('container mx-auto tablet:py-25 desktop-sm:py-30')}>
        <div className={cn('flex flex-col tablet:flex-row tablet:items-center tablet:gap-10 desktop-sm:gap-50')}>
          {/* Image */}
          <div className={cn('order-1 -mx-5 tablet:order-2 tablet:mx-0 tablet:shrink-0')}>
            <div
              className={cn(
                'aspect-390/552 w-full overflow-hidden tablet:aspect-auto tablet:h-130 tablet:w-81.5 tablet:rounded-xl desktop-sm:h-147.5 desktop-sm:w-135.75',
              )}
            >
              <Media resource={image} imgClassName="w-full h-full object-cover" priority />
            </div>
          </div>

          {/* Content */}
          <div className={cn('order-2 pb-15 pt-15 tablet:order-1 tablet:flex-1 tablet:py-0')}>
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
