'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { HomeTestimonialSectionBlock as HomeTestimonialSectionBlockProps } from 'src/payload-types'
import type { Testimonial, Media as MediaType } from 'src/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { useScrollSnap, DotNavigation } from '@/components/ui/ScrollSlider'

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

const VideoThumbnail: React.FC<{
  videoItem: NonNullable<HomeTestimonialSectionBlockProps['videos']>[number]
  className?: string
}> = ({ videoItem, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const media = typeof videoItem.media === 'object' ? videoItem.media : null
  const poster = typeof videoItem.poster === 'object' ? videoItem.poster?.url : undefined

  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.preload = 'auto'
          observer.disconnect()
        }
      },
      { rootMargin: '400px' },
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden rounded-[10px] lg:rounded-[15px]', className)}>
      {media && (
        <>
          <video
            ref={videoRef}
            src={media.url || ''}
            className="h-full w-full object-cover aspect-369/655"
            controls={isPlaying}
            playsInline
            preload="none"
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

  // Mobile: scroll-snap testimonial slider
  const testimonialSlider = useScrollSnap(resolvedTestimonials.length)

  // Mobile: scroll-snap video slider
  const videoSlider = useScrollSnap(videos?.length ?? 0)

  // Autoplay
  const autoplayPausedRef = useRef(false)
  const pauseAutoplay = useCallback(() => { autoplayPausedRef.current = true }, [])
  const resumeAutoplay = useCallback(() => { autoplayPausedRef.current = false }, [])
  const resumeAfterDelay = useCallback(() => {
    setTimeout(() => { autoplayPausedRef.current = false }, 3000)
  }, [])

  useEffect(() => {
    if (resolvedTestimonials.length <= 1) return
    const interval = setInterval(() => {
      if (autoplayPausedRef.current) return
      setDesktopTestimonialIndex(prev => {
        const next = (prev + 1) % resolvedTestimonials.length
        testimonialSlider.scrollTo(next)
        return next
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [resolvedTestimonials.length, testimonialSlider.scrollTo])

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
                onTouchStart={pauseAutoplay}
                onTouchEnd={resumeAfterDelay}
              >
                {resolvedTestimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="snap-start shrink-0 w-82 rounded-[15px] flex flex-col"
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
                      <div className="flex-1 text-body text-navy-50 p-5 bg-navy-1000 rounded-b-[15px]">
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
            <div
              className="hidden md:block"
              onMouseEnter={pauseAutoplay}
              onMouseLeave={resumeAutoplay}
            >
              <div className="grid">
                {resolvedTestimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={cn(
                      'col-start-1 row-start-1 rounded-lg bg-dark-blue-800 transition-opacity duration-500 flex flex-col',
                      index === desktopTestimonialIndex ? 'opacity-100' : 'opacity-0 pointer-events-none',
                    )}
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
                      <div className="flex-1 text-body text-navy-50 p-5 bg-navy-1000 rounded-b-[15px]">
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
