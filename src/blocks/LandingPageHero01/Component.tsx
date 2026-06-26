import React from 'react'

import type { LandingPageHero01Block as LandingPageHero01BlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { LandingHeroForm } from './Form'

type Props = {
  className?: string
} & LandingPageHero01BlockProps

export const LandingPageHero01Block: React.FC<Props> = ({
  background,
  headlineImage,
  headlineText,
  supportiveLead,
  supportiveText,
  bullets,
  formHeading,
  formSubheading,
  form,
  formDisclaimer,
}) => {
  const formDoc = form && typeof form === 'object' ? form : null

  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* Background image */}
      {background && typeof background === 'object' && (
        <div className="absolute inset-0 -z-20">
          <Media resource={background} fill imgClassName="object-cover" priority loading="eager" />
        </div>
      )}
      {/* Overlays for legibility */}
      <div className="absolute inset-0 -z-10 bg-[#00152b]/40" />
      {/* Bottom overlay (all breakpoints): vertical gradient — transparent down to dark over the bottom 64.6% of the image (722/1117) */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-[#00070f]/0 from-[35.36%] to-[#00070f]/80" />
      {/* Left overlay (desktop only): horizontal gradient — dark from the left fading to transparent by 41.78% of the image width (722/1728) */}
      <div className="absolute inset-0 -z-10 hidden desktop:block bg-linear-to-r from-[#00070f]/80 to-[#00070f]/0 to-[41.78%]" />

      <div className="container mx-auto px-5 tablet:px-8 desktop:grid desktop:min-h-[calc(100vh-92px)] desktop:grid-cols-[minmax(0,1fr)_454px] desktop:items-center desktop:gap-x-[62px] desktop:py-16">
        {/* Left: headline + supportive text + bullets.
            On tablet and down it fills the viewport (minus the solid header) so it reads
            as a full screen before the form below; resets inside the grid on desktop. */}
        <div className="flex min-h-[calc(100svh-92px)] flex-col justify-center gap-10 py-8 text-white desktop:min-h-0 desktop:justify-start desktop:gap-[50px] desktop:py-0">
          <div className="flex flex-col gap-8 desktop:gap-[50px]">
            <h1 className="sr-only">{headlineText}</h1>
            {headlineImage && typeof headlineImage === 'object' && (
              <Media
                resource={headlineImage}
                alt=""
                imgClassName="h-auto w-full max-w-[715px]"
                priority
                loading="eager"
                placeholder="empty"
              />
            )}

            {(supportiveLead || supportiveText) && (
              <div className="flex items-stretch gap-5">
                <span aria-hidden className="w-px shrink-0 bg-gold" />
                <p className="text-[18px] leading-snug -tracking-[0.03em] text-navy-50 tablet:text-[28px] desktop:text-[32px]">
                  {supportiveLead && <span className="text-white">{supportiveLead}</span>}{' '}
                  {supportiveText}
                </p>
              </div>
            )}
          </div>

          {bullets && (
            <RichText
              data={bullets}
              enableGutter={false}
              enableProse={false}
              className="hero-bullets"
            />
          )}
        </div>

        {/* Right (desktop) / below (mobile + tablet): consultation form.
            Full-bleed white background below `navbar`, floating white card at/above it. */}
        <div className="mx-[calc(50%-50vw)] bg-white pb-12 pt-10 desktop:mx-0 desktop:bg-transparent desktop:pb-0 desktop:pt-0">
          <div className="container desktop:px-0!">
            <div className="mx-auto flex w-full max-w-[596px] flex-col gap-6 desktop:max-w-none desktop:rounded-[15px] desktop:bg-white desktop:px-8 desktop:pb-[34px] desktop:pt-[35px] desktop:shadow-xl">
            {(formHeading || formSubheading) && (
              <div className="flex flex-col gap-2 text-center">
                {formHeading && (
                  <p className="text-h4 font-semibold -tracking-[0.03em] text-dark-blue">
                    {formHeading}
                  </p>
                )}
                {formSubheading && (
                  <p className="text-body text-deep-blue-900">{formSubheading}</p>
                )}
              </div>
            )}

            {formDoc && <LandingHeroForm form={formDoc} />}

            {formDisclaimer && (
              <p className="text-center text-body-sm text-deep-blue-900 opacity-60">
                {formDisclaimer}
              </p>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
