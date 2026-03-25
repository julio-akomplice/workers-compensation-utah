import React from 'react'

import type { ResourcesPageBlock as ResourcesPageBlockProps, Media } from 'src/payload-types'

import { CMSLink } from '@/components/Link'
import Image from 'next/image'

type Props = {
  className?: string
} & ResourcesPageBlockProps

export const ResourcesPageBlockComponent: React.FC<Props> = ({
  sectionDescription,
  resourceCards,
  ctaLink,
}) => {
  return (
    <section className="w-full bg-white py-[40px] md:py-[60px]">
      <div className="container mx-auto px-5 md:px-8 2xl:px-0">
        {/* Section Description */}
        {sectionDescription && (
          <p className="mx-auto mb-10 max-w-[896px] text-center text-[24px] font-medium leading-[28px] tracking-[-0.72px] text-[#00152b] md:mb-[60px]">
            {sectionDescription}
          </p>
        )}

        {/* Resource Cards Grid */}
        {resourceCards && resourceCards.length > 0 && (
          <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-[25px] sm:grid-cols-2 lg:grid-cols-4">
            {resourceCards.map((card, index) => {
              const image = typeof card.image === 'object' ? (card.image as Media) : null

              return (
                <div
                  key={index}
                  className="flex flex-col items-center rounded-[12px] bg-[#f7f7f7] px-6 pb-8 pt-8"
                >
                  {/* Logo Image */}
                  {image?.url && (
                    <div className="mb-5 flex h-[130px] w-[130px] items-center justify-center overflow-hidden rounded-full">
                      <Image
                        src={image.url}
                        alt={image.alt || card.title || ''}
                        width={130}
                        height={130}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Title */}
                  {card.title && (
                    <h3 className="mb-3 text-center font-semibold leading-[24px] tracking-[-0.6px] text-[#00152b] text-[20px]">
                      {card.title}
                    </h3>
                  )}

                  {/* Website Links */}
                  {card.websites && card.websites.length > 0 && (
                    <div className="flex flex-col items-center">
                      {card.websites.map((site, siteIndex) => (
                        <a
                          key={siteIndex}
                          href={
                            site.url.startsWith('http') ? site.url : `https://${site.url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-center text-[16px] leading-[24px] tracking-[-0.32px] text-[#334455] hover:underline"
                        >
                          {site.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* CTA Button */}
        {ctaLink && (
          <div className="mt-10 flex justify-center md:mt-[60px]">
            <CMSLink
              {...ctaLink}
              appearance="gradient"
              showArrow
              className="text-[18px] font-medium tracking-[-0.36px]"
            />
          </div>
        )}
      </div>
    </section>
  )
}
