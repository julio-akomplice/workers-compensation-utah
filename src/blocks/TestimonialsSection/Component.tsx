'use client'

import React from 'react'

import type { TestimonialsSectionBlock as TestimonialsSectionBlockProps } from 'src/payload-types'
import type { Testimonial } from 'src/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { useScrollSnap, DotNavigation } from '@/components/ui/ScrollSlider'

type Props = {
  className?: string
} & TestimonialsSectionBlockProps

const GoogleIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.171 8.368h-.67v-.035H10v3.333h4.709A5.001 5.001 0 0 1 5 10a5 5 0 0 1 5-5c1.275 0 2.434.48 3.317 1.266l2.357-2.357A8.295 8.295 0 0 0 10 1.667a8.334 8.334 0 1 0 8.171 6.7z"
      fill="#FFC107"
    />
    <path
      d="M2.628 6.121l2.74 2.009A5.002 5.002 0 0 1 10 5c1.275 0 2.434.48 3.317 1.266l2.357-2.357A8.295 8.295 0 0 0 10 1.667 8.329 8.329 0 0 0 2.628 6.12z"
      fill="#FF3D00"
    />
    <path
      d="M10 18.333a8.294 8.294 0 0 0 5.587-2.163l-2.579-2.183A4.963 4.963 0 0 1 10 15a5.001 5.001 0 0 1-4.701-3.316l-2.72 2.095A8.326 8.326 0 0 0 10 18.333z"
      fill="#4CAF50"
    />
    <path
      d="M18.171 8.368H17.5v-.035H10v3.333h4.71a5.017 5.017 0 0 1-1.703 2.321l2.58 2.183c-.183.166 2.746-2.003 2.746-6.17 0-.559-.057-1.104-.163-1.632z"
      fill="#1976D2"
    />
  </svg>
)

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <span key={i} className="text-gold">
          &#9733;
        </span>,
      )
    } else if (i - 0.5 <= rating) {
      stars.push(
        <span key={i} className="text-gold">
          &#9733;
        </span>,
      )
    } else {
      stars.push(
        <span key={i} className="text-gray-400">
          &#9733;
        </span>,
      )
    }
  }
  return <div className="flex gap-0.5 text-lg">{stars}</div>
}

const TestimonialCard: React.FC<{
  testimonial: Testimonial
  className?: string
}> = ({ testimonial, className }) => {
  return (
    <div className={cn('rounded-[15px] overflow-hidden', className)}>
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
            <div className="flex items-center gap-1.5">
              <p className="text-h6 font-semibold tracking-[-0.6px] text-white">
                {testimonial.name}
              </p>
              <GoogleIcon />
            </div>
            <p className="text-[16px] tracking-[-0.32px] text-navy-50">{testimonial.title}</p>
          </div>
        </div>
        <StarRating rating={testimonial.rating} />
      </div>
      {/* Body */}
      {testimonial.testimonial && 'root' in testimonial.testimonial && (
        <div className="bg-navy-1000 px-5 py-5 text-[16px] leading-[24px] tracking-[-0.32px] text-navy-50 lg:text-[17px] lg:leading-[25px] lg:tracking-[-0.34px]">
          <RichText data={testimonial.testimonial} enableGutter={false} enableProse={false} />
        </div>
      )}
    </div>
  )
}

export const TestimonialsSectionBlock: React.FC<Props> = ({
  sectionHeader,
  testimonials,
  link,
}) => {
  const resolvedTestimonials = (testimonials ?? []).filter(
    (t): t is Testimonial => typeof t !== 'string',
  )

  const testimonialSlider = useScrollSnap(resolvedTestimonials.length)

  return (
    <section
      className="w-full py-[60px] md:py-20 lg:py-[100px]"
      style={{
        background: 'linear-gradient(180deg, #001F3E 0%, #00172D 100%)',
      }}
    >
      <div className="container mx-auto px-5 md:px-8">
        {/* Section Header */}
        {sectionHeader && 'root' in sectionHeader && (
          <div className="section-header section-header--dark text-center mb-10 md:mb-[50px] lg:mb-[60px]">
            <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
          </div>
        )}

        {/* Desktop: 3-column grid */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-5">
          {resolvedTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        {/* Tablet: Masonry 2-column layout */}
        <div className="hidden md:block lg:hidden" style={{ columns: 2, columnGap: '20px' }}>
          {resolvedTestimonials.map((testimonial, index) => (
            <div key={index} className="mb-5 break-inside-avoid">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>

        {/* Mobile: Horizontal slider */}
        <div className="md:hidden -mr-5">
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

        {/* CTA Button */}
        {link && (
          <div className="mt-10 md:mt-[50px] flex justify-center">
            <CMSLink {...link} />
          </div>
        )}
      </div>
    </section>
  )
}
