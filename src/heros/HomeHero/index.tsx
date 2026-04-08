'use client'

import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

const ScrollIndicator: React.FC = () => (
  <div className="row-start-3 w-fit h-fit mx-auto">
    <svg width={44} height={44} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx={21.9818}
        cy={21.8404}
        r={20.8426}
        transform="rotate(90 21.9818 21.8404)"
        stroke="#F7F7F7"
        strokeWidth={1.5}
      />
      <mask
        id="mask0_1438_10007"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x={8}
        y={8}
        width={28}
        height={28}
      >
        <rect
          x={35.4616}
          y={8.1836}
          width={26.8889}
          height={26.8889}
          transform="rotate(90 35.4616 8.1836)"
          fill="#D9D9D9"
        />
      </mask>
      <g mask="url(#mask0_1438_10007)">
        <path
          d="M21.1774 26.7943L21.1774 14.0653C21.1774 13.8268 21.2579 13.6272 21.4188 13.4664C21.5796 13.3055 21.7792 13.225 22.0177 13.225C22.2561 13.225 22.4557 13.3055 22.6165 13.4664C22.7775 13.6272 22.8579 13.8268 22.8579 14.0653L22.8579 26.7943L26.5465 23.1058C26.7132 22.9392 26.9083 22.857 27.1316 22.859C27.3549 22.8613 27.5535 22.9435 27.7274 23.1058C27.901 23.2796 27.9907 23.4793 27.9965 23.7046C28.0023 23.9302 27.9183 24.1299 27.7444 24.3038L22.7266 29.3216C22.6216 29.4266 22.511 29.5005 22.3947 29.5435C22.2783 29.5866 22.1527 29.6082 22.0177 29.6082C21.8827 29.6082 21.757 29.5866 21.6407 29.5435C21.5243 29.5005 21.4137 29.4266 21.3088 29.3216L16.2909 24.3038C16.1243 24.137 16.0421 23.9392 16.0441 23.7102C16.0464 23.4811 16.1343 23.2796 16.308 23.1058C16.4818 22.9435 16.6786 22.8595 16.8984 22.8537C17.1182 22.8479 17.315 22.932 17.4889 23.1058L21.1774 26.7943Z"
          fill="#F7F7F7"
        />
      </g>
    </svg>
  </div>
)

export const HomeHero: React.FC<Page['hero'] & { svgContent?: string | null }> = ({
  links,
  supportiveText,
  headlineImage,
  backgroundVideo,
  background,
  svgContent,
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <section className="relative text-black h-screen overflow-hidden pb-12.5">
      {/* Background Video or Image */}
      {backgroundVideo?.video && typeof backgroundVideo.video === 'object' ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
          poster={
            backgroundVideo.poster && typeof backgroundVideo.poster === 'object'
              ? getMediaUrl(`/media/${backgroundVideo.poster.filename}`)
              : undefined
          }
        >
          <source src={getMediaUrl(`/media/${backgroundVideo.video.filename}`)} />
        </video>
      ) : (
        background &&
        typeof background === 'object' && (
          <Media
            resource={background}
            fill
            imgClassName="object-cover -z-10"
            priority
            loading="eager"
          />
        )
      )}

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 -z-5 opacity-80"
        style={{ background: 'linear-gradient(0deg, #00070F 0%, rgba(0, 7, 15, 0.00) 100%)' }}
      />

      <div className="grid grid-rows-[50px_1fr_50px] items-center justify-center h-full">
        {/* Content */}

        <div className="relative z-10 flex flex-col items-center text-center px-8 md:px-12 lg:px-4 row-start-2">
          {supportiveText && <p className="text-white caption-heading">{supportiveText}</p>}

          <h1 className="sr-only">Workers Compensation Utah</h1>
          {headlineImage && typeof headlineImage === 'object' && (
            <div className="mt-8.75">
              <Media
                resource={headlineImage}
                svgContent={svgContent}
                imgClassName=""
                className={cn('w-full max-w-[90vw] md:max-w-[80vw] lg:max-w-200 [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-w-[90vw] [&_svg]:md:max-w-[80vw] [&_svg]:lg:max-w-200')}
                priority
                loading="eager"
                placeholder="empty"
              />
            </div>
          )}

          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex gap-4 mt-10">
              {links.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink {...link} appearance="gradient" />
                </li>
              ))}
            </ul>
          )}
        </div>
        <ScrollIndicator />
      </div>
    </section>
  )
}
