import React from 'react'

import type { HomeCaseStudiesSectionBlock as HomeCaseStudiesSectionBlockProps } from 'src/payload-types'
import type { CaseStudy } from 'src/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
} & HomeCaseStudiesSectionBlockProps

export const HomeCaseStudiesSectionBlock: React.FC<Props> = ({
  sectionHeader,
  selectedCaseStudies,
  link,
}) => {
  const caseStudies = (selectedCaseStudies || []).filter(
    (study): study is CaseStudy => typeof study !== 'string',
  )

  return (
    <section className="w-full bg-white py-16 md:py-25">
      <div className="container mx-auto px-4">
        {sectionHeader && 'root' in sectionHeader && (
          <div className="mb-14.5 text-center section-header">
            <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
          </div>
        )}

        {caseStudies.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {caseStudies.map((caseStudy, index) => (
              <div
                key={index}
                className="flex flex-col rounded-[10px] bg-off-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)]"
              >
                <p
                  className={cn(
                    'text-h6 font-semibold text-off-black pb-5 border-b border-[#CCD5DF] ',
                    caseStudy.alternativeCategory && 'whitespace-pre-line',
                  )}
                >
                  {caseStudy.alternativeCategory || caseStudy.category}
                </p>

                <p className="mt-5 text-[2rem] text-h3 font-semibold text-orange">
                  {caseStudy.settlementAmount}
                </p>

                <p className="mt-5 text-body text-deep-blue-800">{caseStudy.description}</p>
              </div>
            ))}
          </div>
        )}

        {link && (
          <div className="mt-10 flex justify-center">
            <CMSLink {...link} />
          </div>
        )}
      </div>
    </section>
  )
}
