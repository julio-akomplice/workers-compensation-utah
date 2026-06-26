import React from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { Phone } from 'lucide-react'

import wcuLogo from './wcu-logo.webp'

/**
 * Static, frontend-only footer for landing pages.
 *
 * Content is hardcoded (no CMS) per the WCU landing design. Responsive across
 * mobile / tablet / desktop; the logo is a 2x-optimized PNG.
 */

const PHONE = { value: '(801) 424-9675', href: 'tel:8014249675' }
const OFFICE = {
  value: '2046 E Murray Holladay Rd #108 Holladay, UT 84117',
  mapUrl: 'https://maps.google.com/?q=2046+E+Murray+Holladay+Rd+%23108+Holladay+UT+84117',
}
const SERVING = 'Salt Lake City, Ogden, Provo, St. George, Vernal & all of Utah'

const DISCLAIMER: string[] = [
  'This website is attorney advertising and is provided for general information only; it is not legal advice. Viewing this site or contacting us does not create an attorney-client relationship.',
  'Past results do not guarantee future outcomes — every case is different and is decided on its own facts.',
  'Free consultation — no cost, no obligation. If we represent you, costs and expenses may apply; your fee arrangement will be explained in a written agreement.',
  'Workers Compensation Utah was formerly known as King & Burke, P.C., and has represented injured Utah workers for over 30 years. We only practice law in Utah.',
  '© 2026 Workers Compensation Utah. All rights reserved.',
]

const headingClass = 'text-body font-medium text-white tracking-[-0.32px] leading-normal'
const valueClass = 'text-body font-medium text-navy-200 tracking-[-0.32px] leading-normal'

export const LandingFooter: React.FC = () => {
  const logoEl = (
    <Link href="/" className="block h-17.25 w-51.75 shrink-0" aria-label="Workers Compensation Utah — home">
      <NextImage
        src={wcuLogo}
        alt="Workers Compensation Utah"
        sizes="207px"
        className="h-17.25 w-51.75 object-contain object-left"
      />
    </Link>
  )

  const callCol = (
    <div className="flex flex-col gap-5">
      <h3 className={headingClass}>Call</h3>
      <a
        href={PHONE.href}
        className={`flex items-center gap-2.5 ${valueClass} transition-colors hover:text-white`}
      >
        <Phone className="size-6 shrink-0 text-orange" fill="currentColor" strokeWidth={0} />
        <span className="whitespace-nowrap">{PHONE.value}</span>
      </a>
    </div>
  )

  const officeCol = (
    <div className="flex flex-col gap-5">
      <h3 className={headingClass}>Office</h3>
      <a
        href={OFFICE.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${valueClass} max-w-57 transition-colors hover:text-white`}
      >
        {OFFICE.value}
      </a>
    </div>
  )

  const servingCol = (
    <div className="flex flex-col gap-5">
      <h3 className={headingClass}>Serving</h3>
      <p className={`${valueClass} max-w-57`}>{SERVING}</p>
    </div>
  )

  const disclaimerEl = (align: string) => (
    <div
      className={`flex flex-col text-body-sm font-normal text-white/40 tracking-[-0.28px] leading-5.5 ${align}`}
    >
      {DISCLAIMER.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  )

  return (
    <footer className="w-full bg-dark-blue">
      <div className="container mx-auto px-5 md:px-8 2xl:px-0 pt-15 pb-7.5 lg:py-15">
        {/* ===== MOBILE layout (< 768px) ===== */}
        <div className="flex flex-col gap-10 md:hidden">
          <div className="flex flex-col gap-15">
            <div className="flex flex-col gap-7.5">
              {callCol}
              {officeCol}
              {servingCol}
            </div>
            {logoEl}
          </div>
          {disclaimerEl('text-left')}
        </div>

        {/* ===== TABLET layout (768px–1023px) ===== */}
        <div className="hidden md:flex md:flex-col md:items-center md:gap-10 lg:hidden">
          <div className="flex w-full flex-col items-center gap-15">
            <div className="flex w-full items-start gap-7.5">
              <div className="flex-1">{callCol}</div>
              <div className="flex-1">{officeCol}</div>
              <div className="flex-1">{servingCol}</div>
            </div>
            {logoEl}
          </div>
          {disclaimerEl('text-center')}
        </div>

        {/* ===== DESKTOP layout (1024px+) ===== */}
        <div className="hidden lg:flex lg:flex-col lg:gap-12.5">
          <div className="flex flex-col gap-12.5">
            <div className="flex items-start justify-between gap-8">
              {logoEl}
              <div className="flex items-start gap-20">
                {callCol}
                {officeCol}
                {servingCol}
              </div>
            </div>
            <hr className="border-t border-navy-800" />
          </div>
          {disclaimerEl('text-center')}
        </div>
      </div>
    </footer>
  )
}
