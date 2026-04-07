import React from 'react'

import type { CompleteContentBlock as CompleteContentBlockProps } from 'src/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & CompleteContentBlockProps

export const CompleteContentBlock: React.FC<Props> = ({ sectionHeader, cards }) => {
  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-4">
        {sectionHeader && 'root' in sectionHeader && (
          <div className="mb-12 section-header">
            <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
          </div>
        )}

        {cards && cards.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => (
              <div key={index} className="flex flex-col">
                {card.image && (
                  <div className="mb-4">
                    <Media resource={card.image} imgClassName="w-full rounded" />
                  </div>
                )}

                {card.headline && (
                  <h3 className="text-h5 font-semibold">{card.headline}</h3>
                )}

                {card.content && (
                  <p className="mt-2">{card.content}</p>
                )}

                {card.link && (
                  <div className="mt-4">
                    <CMSLink {...card.link} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
