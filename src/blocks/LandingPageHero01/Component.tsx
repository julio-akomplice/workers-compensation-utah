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
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#00152b]/85 via-[#00152b]/35 to-transparent" />

      <div className="container mx-auto px-5 md:px-8 navbar:grid navbar:min-h-[calc(100vh-92px)] navbar:grid-cols-[minmax(0,1fr)_454px] navbar:items-center navbar:gap-x-[62px] navbar:py-16">
        {/* Left: headline + supportive text + bullets.
            On tablet and down it fills the viewport (minus the solid header) so it reads
            as a full screen before the form below; resets inside the grid on desktop. */}
        <div className="flex min-h-[calc(100svh-92px)] flex-col justify-center gap-10 py-8 text-white navbar:min-h-0 navbar:justify-start navbar:gap-[50px] navbar:py-0">
          <div className="flex flex-col gap-8 navbar:gap-[50px]">
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
                <p className="text-[18px] leading-snug -tracking-[0.03em] text-navy-50 tablet:text-[28px] navbar:text-[32px]">
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
        <div className="-mx-5 bg-white px-5 pb-12 pt-10 md:-mx-8 md:px-8 navbar:mx-0 navbar:bg-transparent navbar:px-0 navbar:pb-0 navbar:pt-0">
          <div className="mx-auto flex w-full max-w-[596px] flex-col gap-6 navbar:max-w-none navbar:rounded-[15px] navbar:bg-white navbar:px-8 navbar:pb-[34px] navbar:pt-[35px] navbar:shadow-xl">
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
    </section>
  )
}
