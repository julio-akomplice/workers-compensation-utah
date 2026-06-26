'use client'

import React from 'react'

import type { LandingPageTestimonialsSectionBlock as LandingPageTestimonialsSectionBlockProps } from 'src/payload-types'
import type { Testimonial } from 'src/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { useScrollSnap, DotNavigation } from '@/components/ui/ScrollSlider'

type Props = {
  className?: string
} & LandingPageTestimonialsSectionBlockProps

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5 text-lg">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < Math.round(rating) ? 'text-gold' : 'text-gray-400'}>
        &#9733;
      </span>
    ))}
  </div>
)

const TestimonialCard: React.FC<{
  testimonial: Testimonial
  className?: string
}> = ({ testimonial, className }) => {
  return (
    <div className={cn('flex h-full flex-col rounded-[15px] overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between bg-navy-900 px-5 py-5">
        <div className="flex items-center gap-3">
          {testimonial.avatar && (
            <div className="h-[54px] w-[54px] shrink-0 overflow-hidden rounded-full">
              <Media
                resource={testimonial.avatar}
                pictureClassName="block h-[54px] w-[54px] object-cover"
                imgClassName="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <p className="text-h6 font-semibold tracking-[-0.6px] text-white">{testimonial.name}</p>
            <p className="text-[16px] tracking-[-0.32px] text-navy-50">{testimonial.title}</p>
          </div>
        </div>
        <StarRating rating={testimonial.rating} />
      </div>
      {/* Body */}
      {testimonial.testimonial && 'root' in testimonial.testimonial && (
        <div className="grow bg-navy-1000 px-5 py-5 text-[16px] leading-[24px] tracking-[-0.32px] text-navy-50 desktop:text-[17px] desktop:leading-[25px] desktop:tracking-[-0.34px]">
          <RichText data={testimonial.testimonial} enableGutter={false} enableProse={false} />
        </div>
      )}
    </div>
  )
}

export const LandingPageTestimonialsSectionBlock: React.FC<Props> = ({
  sectionHeader,
  testimonials,
}) => {
  const resolvedTestimonials = (testimonials ?? []).filter(
    (t): t is Testimonial => typeof t !== 'string',
  )
  const testimonialSlider = useScrollSnap(resolvedTestimonials.length)

  return (
    <section
      className="w-full py-[60px] tablet:py-20 desktop:py-[120px]"
      style={{
        background: 'linear-gradient(180deg, #001F3E 0%, #00172D 100%)',
      }}
    >
      <div className="container mx-auto px-5 tablet:px-8">
        {/* Section Header */}
        {sectionHeader && 'root' in sectionHeader && (
          <div className="section-header section-header--dark text-center mb-10 tablet:mb-[50px] desktop:mb-[60px]">
            <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
          </div>
        )}

        {/* Desktop: 3-column grid */}
        <div className="hidden desktop:grid desktop:grid-cols-3 desktop:gap-5">
          {resolvedTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        {/* Tablet: single centered column */}
        <div className="hidden tablet:flex tablet:flex-col tablet:items-center tablet:gap-5 desktop:hidden">
          {resolvedTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} className="w-full max-w-[520px]" />
          ))}
        </div>

        {/* Mobile: Horizontal slider */}
        <div className="tablet:hidden -mr-5">
          <div
            ref={testimonialSlider.scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pr-5"
          >
            {resolvedTestimonials.map((testimonial, index) => (
              <div key={index} className="snap-start shrink-0 w-[328px]">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
          <DotNavigation
            count={resolvedTestimonials.length}
            activeIndex={testimonialSlider.activeIndex}
            onDotClick={(i) => testimonialSlider.scrollTo(i)}
            className="mt-[30px]"
          />
        </div>
      </div>
    </section>
  )
}
