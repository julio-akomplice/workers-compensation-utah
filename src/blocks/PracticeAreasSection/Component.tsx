import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { PracticeAreasSectionBlock as PracticeAreasSectionBlockProps } from 'src/payload-types'
import type { PracticeArea } from 'src/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

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
        {sectionHeader && (
          <div className="mb-12 text-center">
            {sectionHeader.supportiveText && (
              <p className="mb-4 text-caption text-navy-600">
                {sectionHeader.supportiveText}
              </p>
            )}
            {sectionHeader.headline && (
              <h2 className="text-h3 font-medium text-navy-1000 md:text-h2">
                {sectionHeader.headline}
              </h2>
            )}
            {sectionHeader.content && (
              <p className="mx-auto mt-4 max-w-2xl text-body text-navy-500">
                {sectionHeader.content}
              </p>
            )}
          </div>
        )}

        {practiceAreas.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {practiceAreas.map((practiceArea, index) => (
              <div key={index} className="flex flex-col">
                {practiceArea.general?.icon && (
                  <div className="mb-4">
                    <Media
                      resource={practiceArea.general.icon}
                      imgClassName="h-10 w-10 object-contain"
                    />
                  </div>
                )}

                <h3 className="text-h6 font-semibold text-navy-1000">
                  {practiceArea.general?.alternativeTitle || practiceArea.title}
                </h3>

                {practiceArea.general?.shortDescription && (
                  <p className="mt-2 text-body-sm text-navy-500">
                    {practiceArea.general.shortDescription}
                  </p>
                )}

                <a
                  href={`/practice-areas/${practiceArea.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-cta-tertiary text-navy-1000 hover:text-orange"
                >
                  Learn More
                  <span className="text-orange">&rarr;</span>
                </a>
              </div>
            ))}
          </div>
        )}

        {link && (
          <div className="mt-12 flex justify-center">
            <CMSLink
              {...link}
              className="inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 text-cta-primary text-white hover:bg-tangerine"
            />
          </div>
        )}
      </div>
    </section>
  )
}
