import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { PracticeAreasSectionBlock as PracticeAreasSectionBlockProps } from 'src/payload-types'
import type { PracticeArea } from 'src/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import Link from 'next/link'
import { ArrowIcon } from '@/components/ui/ArrowIcon'

type Props = {
  className?: string
} & PracticeAreasSectionBlockProps

export const PracticeAreasSectionBlock: React.FC<Props> = async ({
  sectionHeader,
  populateBy,
  limit,
  selectedPracticeAreas,
  link,
}) => {
  let practiceAreas: PracticeArea[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'practice-areas',
      limit: limit || 10,
      sort: 'title',
    })
    practiceAreas = result.docs
  } else if (selectedPracticeAreas && selectedPracticeAreas.length > 0) {
    practiceAreas = selectedPracticeAreas.filter(
      (area): area is PracticeArea => typeof area !== 'number',
    )
  }

  return (
    <section className="w-full bg-off-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        {sectionHeader && 'root' in sectionHeader && (
          <div className="mb-14.5 ">
            <RichText
              data={sectionHeader}
              enableGutter={false}
              enableProse={false}
              className="text-center section-header items-center *:mx-auto [&_p]:max-w-[55ch]"
            />
          </div>
        )}

        {practiceAreas.length > 0 && (
          <div className="grid grid-cols-2 gap-x-8 gap-y-7.5 md:grid-cols-3 lg:grid-cols-5">
            {practiceAreas.map((practiceArea, index) => {
              return (
                <div key={index} className="flex flex-col border-b-[1.5px] border-navy-50 pb-3.75">
                  {practiceArea.general?.icon && (
                    <div className="mb-4 [&_svg]:h-10 [&_svg]:w-10">
                      <Media
                        resource={practiceArea.general.icon}
                        className="object-contain"
                      />
                    </div>
                  )}

                  <h3 className="whitespace-pre-line text-h5 font-semibold text-dark-blue">
                    {practiceArea.general?.alternativeTitle || practiceArea.title}
                  </h3>

                  {practiceArea.general?.shortDescription && (
                    <p className="mt-3 flex-1 text-body text-deep-blue-800">
                      {practiceArea.general.shortDescription}
                    </p>
                  )}

                  <Link
                    href={`${practiceArea.slug}`}
                    className="group mt-4 inline-flex items-center gap-1 text-cta-tertiary text-navy-500"
                  >
                    <span className="group-hover:underline">Learn More</span>
                    <ArrowIcon className="w-6 h-6 text-gold transition-transform group-hover:translate-x-0.75" />
                  </Link>
                </div>
              )
            })}
          </div>
        )}

        {link && (
          <div className="mt-12 flex justify-center">
            <CMSLink {...link} className="" />
          </div>
        )}
      </div>
    </section>
  )
}
