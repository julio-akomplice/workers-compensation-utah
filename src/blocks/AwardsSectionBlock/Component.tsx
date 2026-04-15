import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'

import type { AwardsSectionBlock as AwardsSectionBlockProps } from 'src/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
} & AwardsSectionBlockProps

const getAwardsSection = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'awards-section', depth: 2 })
  },
  ['global_awards-section'],
  { tags: ['global_awards-section'] },
)

export const AwardsSectionBlockComponent: React.FC<Props> = async ({
  overrideHeadline,
  overrideGallery,
  headline: overriddenHeadline,
  gallery: overriddenGallery,
}) => {
  const global = await getAwardsSection()

  const headline = overrideHeadline && overriddenHeadline ? overriddenHeadline : global.headline
  const gallery = overrideGallery && overriddenGallery ? overriddenGallery : global.gallery

  return (
    <section className="w-full bg-white py-4">
      <div className="container mx-auto flex flex-row items-center gap-4 px-4 md:gap-16 md:justify-center">
        <h2 className="hidden shrink-0 text-h5 font-medium text-navy-1000 whitespace-nowrap md:block">
          {headline}
        </h2>
        <div
          className={cn(
            'flex flex-1 flex-nowrap items-center justify-between gap-4',
            'md:gap-8',
            'lg:gap-12.5',
          )}
        >
          {gallery?.map((item, index) => {
            return (
              <Media
                key={index}
                resource={item.image}
                imgClassName={cn(
                  'h-15 w-auto shrink-0 grayscale object-contain md:h-10',
                  'md:h-24',
                  'xl:h-32',
                )}
                placeholder="empty"
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
