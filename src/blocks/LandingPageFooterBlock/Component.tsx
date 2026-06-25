import React from 'react'
import { Phone } from 'lucide-react'

import type { LandingPageFooterBlock as LandingPageFooterBlockProps } from 'src/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & LandingPageFooterBlockProps

const headingClass = 'text-body font-medium text-white tracking-[-0.32px] leading-normal'
const valueClass = 'text-body font-medium text-navy-200 tracking-[-0.32px] leading-normal'

export const LandingPageFooterBlock: React.FC<Props> = ({
  link,
  phone,
  office,
  serving,
  disclaimer,
}) => {
  const logo = link?.logo

  const logoMedia =
    logo && typeof logo === 'object' ? (
      <Media
        resource={logo}
        className="h-17.25 w-51.75 [&_svg]:h-full [&_svg]:w-full"
        imgClassName="h-17.25 w-51.75 object-contain"
      />
    ) : null

  const hasLinkTarget = Boolean(link?.url || link?.reference)

  const logoEl = logoMedia ? (
    hasLinkTarget ? (
      <CMSLink
        {...link}
        appearance="inline"
        showArrow={false}
        className="block h-17.25 w-51.75 shrink-0"
      >
        {logoMedia}
      </CMSLink>
    ) : (
      <span className="block h-17.25 w-51.75 shrink-0">{logoMedia}</span>
    )
  ) : null

  const callCol = (
    <div className="flex flex-col gap-5">
      <h3 className={headingClass}>{phone?.label}</h3>
      {phone?.url && (
        <a
          href={phone.url}
          className={`flex items-center gap-2.5 ${valueClass} transition-colors hover:text-white`}
        >
          <Phone className="size-6 shrink-0 text-orange" fill="currentColor" strokeWidth={0} />
          <span className="whitespace-nowrap">{phone.value}</span>
        </a>
      )}
    </div>
  )

  const officeCol = (
    <div className="flex flex-col gap-5">
      <h3 className={headingClass}>{office?.label}</h3>
      {office?.mapUrl ? (
        <a
          href={office.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${valueClass} max-w-57 transition-colors hover:text-white`}
        >
          {office.value}
        </a>
      ) : (
        <p className={`${valueClass} max-w-57`}>{office?.value}</p>
      )}
    </div>
  )

  const servingCol = (
    <div className="flex flex-col gap-5">
      <h3 className={headingClass}>{serving?.label}</h3>
      <p className={`${valueClass} max-w-57`}>{serving?.value}</p>
    </div>
  )

  const disclaimerEl = (align: string) =>
    disclaimer ? (
      <RichText
        data={disclaimer}
        enableGutter={false}
        enableProse={false}
        className={`text-body-sm font-normal text-white/40 tracking-[-0.28px] leading-5.5 [&_a]:underline hover:[&_a]:text-white ${align}`}
      />
    ) : null

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
