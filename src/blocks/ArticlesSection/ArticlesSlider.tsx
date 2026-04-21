'use client'

import React, { useCallback, useRef, useState, useEffect } from 'react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import type { Post, Category, Media as MediaType } from '@/payload-types'
import { ArrowIcon } from '@/components/ui/ArrowIcon'
import placeholderImage from '@/assets/placeholder/image-wcu-placeholder-cards.webp'

type ArticlesSliderProps = {
  posts: Post[]
  link?: any
}

const SliderArrow: React.FC<{ direction: 'left' | 'right'; className?: string }> = ({ direction, className }) => (
  <div className={`relative flex items-center justify-center w-11 h-11 rounded-full border border-navy-200 ${className || ''}`}>
    <ArrowIcon className={`w-6 h-6 text-navy-500 ${direction === 'left' ? 'rotate-180' : ''}`} />
  </div>
)

export const ArticlesSlider: React.FC<ArticlesSliderProps> = ({ posts, link }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 5)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el || !el.children.length) return
    const child = el.children[0] as HTMLElement
    const gap = parseFloat(getComputedStyle(el).gap) || 0
    const scrollAmount = child.offsetWidth + gap
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }, [])

  const getCategories = (post: Post): Category[] => {
    if (!post.categories) return []
    return post.categories.filter((c): c is Category => typeof c === 'object')
  }

  return (
    <div className="articles-section-slider">
      {/* Cards area with arrows */}
      <div className="relative">
        {/* Desktop arrows - positioned at the edges, vertically centered with images */}
        <button
          onClick={() => scroll('left')}
          className="hidden lg:flex absolute left-0 top-[106px] -translate-x-[calc(100%+17px)] -translate-y-1/2 z-10 cursor-pointer items-center justify-center transition-opacity"
          style={{ opacity: canScrollLeft ? 1 : 0.4 }}
          aria-label="Previous articles"
        >
          <SliderArrow direction="left" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="hidden lg:flex absolute right-0 top-[106px] translate-x-[calc(100%+17px)] -translate-y-1/2 z-10 cursor-pointer items-center justify-center transition-opacity"
          style={{ opacity: canScrollRight ? 1 : 0.4 }}
          aria-label="Next articles"
        >
          <SliderArrow direction="right" />
        </button>

        {/* Scrollable cards container */}
        <div
          ref={scrollRef}
          className="flex gap-[20px] md:gap-[15px] lg:gap-[25px] overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          {posts.map((post, index) => {
            const categories = getCategories(post)
            const metaImage =
              post.meta?.image && typeof post.meta.image === 'object'
                ? (post.meta.image as MediaType)
                : null
            const heroImage =
              typeof post.heroImage === 'object' ? (post.heroImage as MediaType) : null
            const image = metaImage || heroImage
            const metaDescription = post.meta?.description || ''

            return (
              <a
                key={post.id}
                href={`/blogs/${post.slug}`}
                className="articles-card snap-start shrink-0 w-[350px] md:w-[calc(50%-7.5px)] lg:w-[calc(33.333%-16.667px)] flex flex-col group"
              >
                {/* Image */}
                <div className="aspect-378/213 rounded-[10px] overflow-hidden">
                  {image ? (
                    <Media
                      resource={image}
                      imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={placeholderImage.src}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 mt-[16px] md:mt-[18px]">
                  {/* Category tags */}
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <span
                          key={category.id}
                          className="border border-navy-100 rounded-full px-2.5 py-0.5 text-body-sm font-medium text-navy-300 tracking-[-0.28px]"
                        >
                          {category.title}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title + Description */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-h6 font-semibold text-dark-blue tracking-[-0.6px]">
                      {post.title}
                    </h3>
                    {/* Description - hidden on mobile */}
                    {metaDescription && (
                      <p className="hidden md:line-clamp-3 text-body text-deep-blue-800 tracking-[-0.32px]">
                        {metaDescription}
                      </p>
                    )}
                  </div>

                  {/* Read More */}
                  <div className="flex items-center gap-1 text-navy-500 font-medium text-body tracking-[-0.32px]">
                    <span>Read More</span>
                    <ArrowIcon className="w-6 h-6 text-gold" />
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>

      {/* Bottom controls: arrows (mobile/tablet) + CTA */}
      <div className="mt-[50px] md:mt-[50px]">
        {/* Mobile: arrows centered, CTA below */}
        <div className="flex flex-col items-center gap-[30px] md:hidden">
          <div className="flex items-center gap-5">
            <button
              onClick={() => scroll('left')}
              className="cursor-pointer transition-opacity"
              style={{ opacity: canScrollLeft ? 1 : 0.4 }}
              aria-label="Previous articles"
            >
              <SliderArrow direction="left" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="cursor-pointer transition-opacity"
              style={{ opacity: canScrollRight ? 1 : 0.4 }}
              aria-label="Next articles"
            >
              <SliderArrow direction="right" />
            </button>
          </div>
          {link && <CMSLink {...link} />}
        </div>

        {/* Tablet: arrows left/right flanking CTA */}
        <div className="hidden md:flex lg:hidden items-center justify-between w-full">
          <button
            onClick={() => scroll('left')}
            className="cursor-pointer transition-opacity"
            style={{ opacity: canScrollLeft ? 1 : 0.4 }}
            aria-label="Previous articles"
          >
            <SliderArrow direction="left" />
          </button>
          {link && <CMSLink {...link} />}
          <button
            onClick={() => scroll('right')}
            className="cursor-pointer transition-opacity"
            style={{ opacity: canScrollRight ? 1 : 0.4 }}
            aria-label="Next articles"
          >
            <SliderArrow direction="right" />
          </button>
        </div>

        {/* Desktop: CTA centered (arrows are on the sides of cards above) */}
        <div className="hidden lg:flex justify-center">
          {link && <CMSLink {...link} />}
        </div>
      </div>
    </div>
  )
}
