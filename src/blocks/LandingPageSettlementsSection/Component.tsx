import React from 'react'

import type { LandingPageSettlementsSectionBlock as LandingPageSettlementsSectionBlockProps } from 'src/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & LandingPageSettlementsSectionBlockProps

export const LandingPageSettlementsSectionBlock: React.FC<Props> = ({
  sectionHeader,
  image,
  settlements,
  disclaimer,
}) => {
  return (
    <section className="w-full bg-white py-[60px] md:py-[100px] lg:py-[120px]">
      <div className="container mx-auto px-5 md:px-8">
        <div className="flex flex-col gap-10 md:gap-[66px] lg:grid lg:grid-cols-[500fr_730fr] lg:items-stretch">
          {/* Image */}
          <div className="relative order-2 h-[366px] w-full overflow-hidden rounded-xl md:order-1 md:h-[630px] lg:h-auto">
            <Media resource={image} fill imgClassName="object-cover" />
          </div>

          {/* Content */}
          <div className="order-1 flex w-full flex-col gap-[30px] md:order-2">
            <div className="flex flex-col gap-5">
              {sectionHeader && 'root' in sectionHeader && (
                <div className="section-header">
                  <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
                </div>
              )}

              {/* Settlements list */}
              <div className="flex flex-col">
                {(settlements ?? []).map((settlement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-5 border-b border-navy-50 py-[30px] md:gap-10"
                  >
                    <p className="w-[162px] shrink-0 text-[24px] font-semibold leading-[28px] tracking-[-0.72px] text-dark-blue md:w-[200px]">
                      {settlement.amount}
                    </p>
                    <p className="flex-1 text-[16px] leading-[24px] tracking-[-0.32px] md:text-[17px] md:leading-[25px] md:tracking-[-0.34px] lg:text-[16px] lg:leading-[24px] lg:tracking-[-0.32px]">
                      <span className="font-semibold text-dark-blue">{settlement.label}</span>
                      {settlement.description && (
                        <>
                          <span className="text-dark-blue">{' — '}</span>
                          <span className="text-deep-blue-800">{settlement.description}</span>
                        </>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {disclaimer && (
              <p className="text-[14px] leading-[22px] tracking-[-0.28px] text-deep-blue-800 opacity-80 lg:max-w-137">
                {disclaimer}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
