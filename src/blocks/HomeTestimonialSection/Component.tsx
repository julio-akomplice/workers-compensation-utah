'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { HomeTestimonialSectionBlock as HomeTestimonialSectionBlockProps } from 'src/payload-types'
import type { Testimonial, Media as MediaType } from 'src/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
} & HomeTestimonialSectionBlockProps

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

const PlayButton: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74" fill="none">
    <circle cx="37" cy="37" r="37" fill="#00070F" fillOpacity="0.3" />
    <path
      d="M53 34.7679C54.3333 35.5377 54.3333 37.4622 53 38.232L29.75 51.6554C28.4167 52.4252 26.75 51.463 26.75 49.9234L26.75 23.0766C26.75 21.537 28.4167 20.5748 29.75 21.3446L53 34.7679Z"
      fill="white"
    />
    <defs>
      <clipPath id="bgblur_play_clip" transform="translate(50 50)">
        <circle cx="37" cy="37" r="37" />
      </clipPath>
    </defs>
  </svg>
)

const DotNavigation: React.FC<{
  count: number
  activeIndex: number
  onDotClick: (index: number) => void
  className?: string
}> = ({ count, activeIndex, onDotClick, className }) => {
  if (count <= 1) return null
  return (
    <div className={cn('flex gap-2 justify-center', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`h-2.5 w-2.5 rounded-full transition-colors cursor-pointer ${
            index === activeIndex ? 'bg-gold' : 'bg-navy-700'
          }`}
          aria-label={`View item ${index + 1}`}
        />
      ))}
    </div>
  )
}

const VideoThumbnail: React.FC<{
  videoItem: NonNullable<HomeTestimonialSectionBlockProps['videos']>[number]
  className?: string
}> = ({ videoItem, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const media = typeof videoItem.media === 'object' ? videoItem.media : null
  const poster = typeof videoItem.poster === 'object' ? videoItem.poster?.url : undefined

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <div className={cn('relative overflow-hidden rounded-[10px] lg:rounded-[15px]', className)}>
      {media && (
        <>
          <video
            ref={videoRef}
            src={media.url || ''}
            className="h-full w-full object-cover aspect-369/655"
            controls={isPlaying}
            playsInline
            poster={poster || undefined}
            onPause={() => setIsPlaying(false)}
          />
          {!isPlaying && (
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              aria-label="Play video"
            >
              <PlayButton />
            </button>
          )}
        </>
      )}
    </div>
  )
}

/** Hook to sync scroll-snap position with dot index */
function useScrollSnap(itemCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el || !el.children.length) return
    const scrollLeft = el.scrollLeft
    const childWidth = (el.children[0] as HTMLElement).offsetWidth
    const gap = parseFloat(getComputedStyle(el).gap) || 0
    const index = Math.round(scrollLeft / (childWidth + gap))
    setActiveIndex(Math.min(index, itemCount - 1))
  }, [itemCount])

  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current
    if (!el || !el.children.length) return
    const child = el.children[index] as HTMLElement
    if (child) {
      el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return { scrollRef, activeIndex, setActiveIndex, scrollTo }
}

export const HomeTestimonialSectionBlock: React.FC<Props> = ({
  sectionHeader,
  testimonials,
  link,
  videos,
}) => {
  const resolvedTestimonials = (testimonials ?? []).filter(
    (t): t is Testimonial => typeof t !== 'string',
  )

  // Desktop/tablet: click-to-change testimonials
  const [desktopTestimonialIndex, setDesktopTestimonialIndex] = useState(0)
  const activeTestimonial = resolvedTestimonials[desktopTestimonialIndex]

  // Mobile: scroll-snap testimonial slider
  const testimonialSlider = useScrollSnap(resolvedTestimonials.length)

  // Mobile: scroll-snap video slider
  const videoSlider = useScrollSnap(videos?.length ?? 0)

  return (
    <section
      className="w-full py-15 md:py-20 lg:py-24"
      style={{
        background: 'linear-gradient(90deg, #001F3E 0%, #00172D 100%)',
      }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,419px)_1fr] md:items-end lg:gap-33.75 lg:grid-cols-[400px_1fr]">
          {/* Left Column: Header + Testimonial Card + CTA */}
          <div className="flex flex-col">
            {/* Section Header */}
            {sectionHeader && 'root' in sectionHeader && (
              <div
                className={cn(
                  'mb-8 section-header section-header--dark text-white',
                  '[&_h2]:font-medium',
                )}
              >
                <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
              </div>
            )}

            {/* Mobile: Horizontal scroll-snap testimonial slider */}
            <div className="md:hidden -mr-4">
              <div
                ref={testimonialSlider.scrollRef}
                className="flex gap-3.75 overflow-x-auto snap-x snap-mandatory scrollbar-hide pr-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {resolvedTestimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="snap-start shrink-0 w-82 rounded-[15px]"
                  >
                    {/* Avatar + Name + Rating */}
                    <div className="flex items-center justify-between bg-navy-900 p-5 rounded-t-[15px]">
                      <div className="flex items-center gap-3">
                        {testimonial.avatar && (
                          <div className="h-12 w-12 overflow-hidden rounded-full">
                            <Media
                              resource={testimonial.avatar}
                              pictureClassName="block h-12 w-12 object-cover"
                              imgClassName="w-full h-full"
                            />
                          </div>
                        )}
                        <div>
                          <p className="text-h6 font-semibold text-white">{testimonial.name}</p>
                          <p className="text-sm text-gray-300">{testimonial.title}</p>
                        </div>
                      </div>
                      <StarRating rating={testimonial.rating} />
                    </div>
                    {/* Testimonial Text */}
                    {testimonial.testimonial && 'root' in testimonial.testimonial && (
                      <div className="text-body text-navy-50 p-5 bg-navy-1000 rounded-b-[15px]">
                        <RichText
                          data={testimonial.testimonial}
                          enableGutter={false}
                          enableProse={false}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Mobile testimonial dots */}
              <DotNavigation
                count={resolvedTestimonials.length}
                activeIndex={testimonialSlider.activeIndex}
                onDotClick={(i) => testimonialSlider.scrollTo(i)}
                className="mt-4"
              />
            </div>

            {/* Tablet/Desktop: Single testimonial card with dot navigation */}
            <div className="hidden md:block">
              {activeTestimonial && (
                <div className="rounded-lg bg-dark-blue-800">
                  {/* Avatar + Name + Rating */}
                  <div className="flex items-center justify-between bg-navy-900 p-5 rounded-t-[15px]">
                    <div className="flex items-center gap-3">
                      {activeTestimonial.avatar && (
                        <div className="h-12 w-12 overflow-hidden rounded-full">
                          <Media
                            resource={activeTestimonial.avatar}
                            pictureClassName="block h-12 w-12 object-cover"
                            imgClassName="w-full h-full"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-h6 font-semibold text-white">
                          {activeTestimonial.name}
                        </p>
                        <p className="text-sm text-gray-300">{activeTestimonial.title}</p>
                      </div>
                    </div>
                    <StarRating rating={activeTestimonial.rating} />
                  </div>

                  {/* Testimonial Text */}
                  {activeTestimonial.testimonial && 'root' in activeTestimonial.testimonial && (
                    <div className="text-body text-navy-50 p-5 bg-navy-1000 rounded-b-[15px]">
                      <RichText
                        data={activeTestimonial.testimonial}
                        enableGutter={false}
                        enableProse={false}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Dot Navigation */}
              <DotNavigation
                count={resolvedTestimonials.length}
                activeIndex={desktopTestimonialIndex}
                onDotClick={setDesktopTestimonialIndex}
                className="mt-6 !justify-start"
              />
            </div>

            {/* CTA */}
            {link && (
              <div className="mt-8 flex justify-center md:justify-start">
                <CMSLink {...link} />
              </div>
            )}
          </div>

          {/* Right Column: Video Thumbnails — Desktop: 2 videos, Tablet: 1 video */}
          {videos && videos.length > 0 && (
            <div className="hidden md:flex gap-4">
              {videos.map((videoItem, index) => (
                <VideoThumbnail
                  key={index}
                  videoItem={videoItem}
                  className={cn(
                    'flex-1',
                    index > 0 && 'hidden lg:block',
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile: Videos below as horizontal scroll slider */}
        {videos && videos.length > 0 && (
          <div className="md:hidden mt-8 -mr-4">
            <div
              ref={videoSlider.scrollRef}
              className="flex gap-3.75 overflow-x-auto snap-x snap-mandatory scrollbar-hide pr-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {videos.map((videoItem, index) => (
                <VideoThumbnail
                  key={index}
                  videoItem={videoItem}
                  className="snap-start shrink-0 w-64.5"
                />
              ))}
            </div>
            <DotNavigation
              count={videos.length}
              activeIndex={videoSlider.activeIndex}
              onDotClick={(i) => videoSlider.scrollTo(i)}
              className="mt-4"
            />
          </div>
        )}
      </div>
    </section>
  )
}
