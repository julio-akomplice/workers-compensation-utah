'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'

/** Hook to sync scroll-snap position with dot index */
export function useScrollSnap(itemCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el || !el.children.length) return
    // If scrolled to the end, activate last dot
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
      setActiveIndex(itemCount - 1)
      return
    }
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

  return { scrollRef, activeIndex, scrollTo }
}

export const DotNavigation: React.FC<{
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
          className={cn(
            'h-2.5 w-2.5 rounded-full transition-colors cursor-pointer',
            index === activeIndex ? 'bg-gold' : 'bg-navy-700',
          )}
          aria-label={`View item ${index + 1}`}
        />
      ))}
    </div>
  )
}
