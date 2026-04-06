import React from 'react'

import type { CaseStudyPageBlock as CaseStudyPageBlockProps } from 'src/payload-types'
import type { CaseStudy } from 'src/payload-types'

import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { PhoneIcon } from '@/assets/icons/PhoneIcon'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
} & CaseStudyPageBlockProps

export const CaseStudyPageBlockComponent: React.FC<Props> = ({
  sectionHeader,
  phoneLink,
  selectedCaseStudies,
}) => {
  const caseStudies = (selectedCaseStudies || []).filter(
    (study): study is CaseStudy => typeof study !== 'string',
  )

  return (
    <section className="w-full bg-white py-[60px] md:py-[80px]">
      <div className="container mx-auto px-5 md:px-0">
        {/* Header */}
        <div className="mx-auto mb-15 md:mb-10 lg:mb-15 text-center">
          {sectionHeader && (
            <div className="section-header">
              <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
            </div>
          )}

          {phoneLink?.url && (
            <div className="mt-5 md:mt-6">
              <Button asChild>
                <a href={phoneLink.url}>
                  <PhoneIcon className="w-5 h-5 shrink-0 text-white" />
                  {phoneLink.label && <span>{phoneLink.label}</span>}
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Case Study Cards Grid */}
        {caseStudies.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {caseStudies.map((caseStudy, index) => (
              <div
                key={index}
                className="flex flex-col rounded-[15px] bg-off-white p-6"
              >
                <p
                  className={cn(
                    'text-h6 font-semibold text-off-black pb-5 border-b border-navy-50',
                    caseStudy.alternativeCategory && 'whitespace-pre-line',
                  )}
                >
                  {caseStudy.alternativeCategory || caseStudy.category}
                </p>

                <p className="mt-5 text-h3 font-semibold text-orange">
                  {caseStudy.settlementAmount}
                </p>

                <p className="mt-5 text-body text-deep-blue-800">{caseStudy.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
