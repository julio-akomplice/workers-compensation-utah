'use client'

import React, { useRef, useState } from 'react'

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

const VideoThumbnail: React.FC<{
  videoItem: NonNullable<HomeTestimonialSectionBlockProps['videos']>[number]
}> = ({ videoItem }) => {
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
    <div className="relative flex-1 overflow-hidden rounded-[15px]">
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

export const HomeTestimonialSectionBlock: React.FC<Props> = ({
  sectionHeader,
  testimonials,
  link,
  videos,
}) => {
  const resolvedTestimonials = (testimonials ?? []).filter(
    (t): t is Testimonial => typeof t !== 'string',
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const activeTestimonial = resolvedTestimonials[activeIndex]

  return (
    <section
      className="w-full py-16 md:py-24"
      style={{
        background: 'linear-gradient(90deg, #001F3E 0%, #00172D 100%)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 lg:gap-33.75 lg:grid-cols-[400px_1fr]">
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

            {/* Testimonial Card */}
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
                      <p className="text-h6 font-semibold text-white">{activeTestimonial.name}</p>
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
            {resolvedTestimonials.length > 1 && (
              <div className="mt-6 flex gap-2">
                {resolvedTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      index === activeIndex ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* CTA */}
            {link && (
              <div className="mt-8">
                <CMSLink {...link} />
              </div>
            )}
          </div>

          {/* Right Column: Video Thumbnails */}
          {videos && videos.length > 0 && (
            <div className="flex gap-4">
              {videos.map((videoItem, index) => (
                <VideoThumbnail key={index} videoItem={videoItem} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
