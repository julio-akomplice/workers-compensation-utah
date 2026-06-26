import React from 'react'
import Link from 'next/link'
import NextImage from 'next/image'

import { Button } from '@/components/ui/button'
import { PhoneIcon } from '@/assets/icons/PhoneIcon'
import wcuLogo from '@/components/LandingFooter/wcu-logo.webp'

/**
 * Static, frontend-only navbar for landing pages.
 *
 * Matches the Figma landing design: a solid dark-blue bar with the WCU logo on
 * the left and a phone CTA on the right. No nav links or menu — kept minimal to
 * keep visitors on the page.
 */

const PHONE = {
  label: '(801) 424-WORK (9675)',
  href: 'tel:8014249675',
}

export const LandingNavbar: React.FC = () => {
  return (
    <header className="relative z-50 bg-dark-blue">
      <div className="container">
        <div className="flex items-center justify-between py-5 desktop:py-5.5">
          {/* Logo — icon only on small screens, full lockup from md up */}
          <Link
            href="/"
            className="relative z-10 shrink-0"
            aria-label="Workers Compensation Utah — home"
          >
            <span className="block h-12 w-12 overflow-hidden tablet:w-auto tablet:overflow-visible">
              <NextImage
                src={wcuLogo}
                alt="Workers Compensation Utah"
                sizes="147px"
                className="h-12 w-auto max-w-none object-contain object-left"
              />
            </span>
          </Link>

          {/* Phone CTA */}
          <a href={PHONE.href} className="shrink-0">
            <Button className="gap-2 rounded-lg px-3.5 text-[16px] font-medium tracking-[-0.32px] text-white desktop:gap-2.5 desktop:px-6 desktop:text-[20px] desktop:tracking-[-0.4px]">
              <PhoneIcon className="size-5 shrink-0" />
              <span>{PHONE.label}</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Bottom separator line */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-white/30 to-transparent" />
    </header>
  )
}
