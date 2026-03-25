'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'

export const MediumImpactHero: React.FC<Page['hero']> = ({ title, media }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] flex items-center justify-center text-white"
      data-theme="dark"
    >
      {media && typeof media === 'object' && (
        <Media fill imgClassName="object-cover -z-10" priority resource={media} />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-[#00070f]/30 via-transparent to-transparent -z-[5]" />

      <div className="relative z-10 flex items-center justify-center w-full min-h-[300px] md:min-h-[350px] lg:min-h-[400px] pt-[10.4rem]">
        {title && (
          <h1 className="font-medium text-[40px] md:text-[55px] lg:text-[75px] leading-[1.04] tracking-[-0.04em] text-center text-white drop-shadow-[0_2px_4px_rgba(0,7,15,0.1)]">
            {title}
          </h1>
        )}
      </div>
    </div>
  )
}
