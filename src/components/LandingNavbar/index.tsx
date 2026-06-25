import React from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { PhoneIcon } from '@/assets/icons/PhoneIcon'

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
        <div className="flex items-center justify-between py-5 navbar:py-5.5">
          {/* Logo — icon only on small screens, full lockup from md up */}
          <Link
            href="/"
            className="relative z-10 shrink-0"
            aria-label="Workers Compensation Utah — home"
          >
            <span className="block h-12 w-12 overflow-hidden md:w-auto md:overflow-visible">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/Layer_1.svg"
                alt="Workers Compensation Utah"
                width={147}
                height={48}
                className="h-12 w-auto max-w-none"
              />
            </span>
          </Link>

          {/* Phone CTA */}
          <a href={PHONE.href} className="shrink-0">
            <Button className="gap-2 rounded-lg px-3.5 text-[16px] font-medium tracking-[-0.32px] text-white navbar:gap-2.5 navbar:px-6 navbar:text-[20px] navbar:tracking-[-0.4px]">
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
