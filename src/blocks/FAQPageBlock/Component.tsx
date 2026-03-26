import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { FAQPageBlock as FAQPageBlockProps, Faq, Media as MediaType } from '@/payload-types'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { ArrowIcon } from '@/components/ui/ArrowIcon'

type Props = {
  className?: string
} & FAQPageBlockProps

export const FAQPageBlockComponent: React.FC<Props> = async ({ sectionHeader }) => {
  const payload = await getPayload({ config: configPromise })

  const { docs: faqs } = await payload.find({
    collection: 'faq',
    depth: 1,
    limit: 50,
    sort: '-publishedAt',
    where: {
      _status: { equals: 'published' },
    },
  })

  if (!faqs || faqs.length === 0) return null

  return (
    <section className="w-full bg-white py-[40px] md:py-[60px]">
      <div className="container mx-auto px-5 md:px-8 2xl:px-0">
        {/* Section Header */}
        {sectionHeader && 'root' in sectionHeader && (
          <div className="section-header mx-auto mb-10 max-w-[896px] md:mb-[60px]">
            <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
          </div>
        )}

        {/* FAQ Cards Grid */}
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-x-[20px] gap-y-[40px] sm:grid-cols-2 md:gap-x-[25px] md:gap-y-[50px] lg:grid-cols-3">
          {faqs.map((faq) => {
            const image = typeof faq.image === 'object' ? (faq.image as MediaType) : null

            return (
              <a
                key={faq.id}
                href={`/faq/${faq.slug}`}
                className="group flex flex-col"
              >
                {/* Image */}
                {image && (
                  <div className="aspect-[4/3] overflow-hidden rounded-[10px]">
                    <Media
                      resource={image}
                      imgClassName="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="mt-[16px] flex flex-col gap-3 md:mt-[20px]">
                  <h3 className="text-[20px] font-semibold leading-[26px] tracking-[-0.6px] text-dark-blue">
                    {faq.question}
                  </h3>

                  {faq.shortAnswer && (
                    <p className="line-clamp-3 text-[16px] leading-[24px] tracking-[-0.32px] text-deep-blue-800">
                      {faq.shortAnswer}
                    </p>
                  )}

                  {/* Read More */}
                  <div className="mt-1 flex items-center gap-1 text-[16px] font-medium tracking-[-0.32px] text-navy-500">
                    <span>Read More</span>
                    <ArrowIcon className="h-6 w-6 text-gold" />
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
