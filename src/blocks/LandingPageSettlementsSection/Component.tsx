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
    <section className="w-full bg-white py-[60px] tablet:py-[100px] desktop:py-[120px]">
      <div className="container mx-auto px-5 tablet:px-8">
        <div className="flex flex-col gap-10 tablet:gap-[66px] desktop:grid desktop:grid-cols-[500fr_730fr] desktop:items-stretch">
          {/* Image */}
          <div className="relative order-2 h-[366px] w-full overflow-hidden rounded-xl tablet:order-1 tablet:h-[630px] desktop:h-auto">
            <Media resource={image} fill imgClassName="object-cover" />
          </div>

          {/* Content */}
          <div className="order-1 flex w-full flex-col gap-[30px] tablet:order-2">
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
                    className="flex items-center gap-5 border-b border-navy-50 py-[30px] tablet:gap-10"
                  >
                    <p className="w-[162px] shrink-0 text-[24px] font-semibold leading-[28px] tracking-[-0.72px] text-dark-blue tablet:w-[200px]">
                      {settlement.amount}
                    </p>
                    <p className="flex-1 text-[16px] leading-[24px] tracking-[-0.32px] tablet:text-[17px] tablet:leading-[25px] tablet:tracking-[-0.34px] desktop:text-[16px] desktop:leading-[24px] desktop:tracking-[-0.32px]">
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
              <p className="text-[14px] leading-[22px] tracking-[-0.28px] text-deep-blue-800 opacity-80 desktop:max-w-137">
                {disclaimer}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
