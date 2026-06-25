import React from 'react'
import { Phone } from 'lucide-react'

import type { LandingPageCallToActionSectionBlock as LandingPageCallToActionSectionBlockProps } from 'src/payload-types'

import { Button } from '@/components/ui/button'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & LandingPageCallToActionSectionBlockProps

export const LandingPageCallToActionSectionBlock: React.FC<Props> = ({
  sectionHeader,
  phoneLabel,
  link,
}) => {
  return (
    <section className="w-full bg-off-white py-15 md:py-20 lg:py-30">
      <div className="container mx-auto flex flex-col items-center gap-[50px] px-5 text-center md:px-8">
        {sectionHeader && 'root' in sectionHeader && (
          <div className="section-header max-w-[806px] text-balance">
            <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
          </div>
        )}

        <div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
          {phoneLabel && (
            <a href="tel:8014249675" className="no-underline">
              <Button variant="gradient" className="w-full text-[18px] sm:w-auto">
                <Phone className="size-6 shrink-0" fill="currentColor" strokeWidth={0} />
                {phoneLabel}
              </Button>
            </a>
          )}

          {link?.url || link?.reference ? (
            <CMSLink
              {...link}
              appearance="outline"
              className="w-full border-2 border-orange bg-transparent text-[18px] text-orange shadow-none hover:bg-orange hover:text-white sm:w-auto"
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}
