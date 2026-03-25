'use client'

import React from 'react'

import type { AboutGetStartedBlock as AboutGetStartedBlockProps } from 'src/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { useScrollSnap, DotNavigation } from '@/components/ui/ScrollSlider'

type Props = {
  className?: string
} & AboutGetStartedBlockProps

const StepCard: React.FC<{
  step: NonNullable<AboutGetStartedBlockProps['steps']>[number]
}> = ({ step }) => {
  return (
    <div className="border-l-[1.5px] border-navy-30 pl-[30px] flex flex-col gap-6">
      <div className="overflow-hidden rounded-[10px] h-[220px]">
        <Media
          resource={step.image}
          imgClassName="w-full h-full object-cover"
        />
      </div>
      <div>
        <p className="text-base font-medium leading-normal tracking-[-0.32px] text-navy-400 mb-2">
          {step.stepLabel}
        </p>
        <h5 className="text-2xl font-semibold leading-7 tracking-[-0.72px] text-dark-blue mb-4">
          {step.title}
        </h5>
        <p className="text-base font-normal leading-6 tracking-[-0.32px] text-deep-blue-800">
          {step.description}
        </p>
      </div>
    </div>
  )
}

export const AboutGetStartedBlock: React.FC<Props> = ({
  sectionHeader,
  steps,
  link,
}) => {
  const slider = useScrollSnap(steps?.length ?? 0)

  return (
    <section className="w-full py-[60px] md:py-20 lg:py-[100px]">
      <div className="container mx-auto px-5 md:px-8 lg:px-[120px]">
        {/* Section Header */}
        {sectionHeader && 'root' in sectionHeader && (
          <div className="section-header text-center mb-[60px]">
            <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
          </div>
        )}

        {/* Desktop: 3-column grid */}
        {steps && steps.length > 0 && (
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-[50px]">
            {steps.map((step, index) => (
              <StepCard key={step.id || index} step={step} />
            ))}
          </div>
        )}

        {/* Tablet: Horizontal scroll slider */}
        {steps && steps.length > 0 && (
          <div className="hidden md:block lg:hidden">
            <div className="-mr-8">
              <div
                ref={slider.scrollRef}
                className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pr-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {steps.map((step, index) => (
                  <div
                    key={step.id || index}
                    className="snap-start shrink-0 w-[65%]"
                  >
                    <StepCard step={step} />
                  </div>
                ))}
              </div>
            </div>
            <DotNavigation
              count={steps.length}
              activeIndex={slider.activeIndex}
              onDotClick={(i) => slider.scrollTo(i)}
              className="mt-8"
            />
          </div>
        )}

        {/* Mobile: Single column stack */}
        {steps && steps.length > 0 && (
          <div className="flex flex-col [&>*:not(:last-child)]:pb-10 md:hidden">
            {steps.map((step, index) => (
              <StepCard key={step.id || index} step={step} />
            ))}
          </div>
        )}

        {/* CTA Link */}
        {link && (
          <div className="mt-[60px] flex justify-center">
            <CMSLink {...link} />
          </div>
        )}
      </div>
    </section>
  )
}
