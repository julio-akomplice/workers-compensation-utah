import React from 'react'
import Link from 'next/link'

import type {
  Footer as FooterType,
  Page,
  PracticeArea,
  AreasServed as AreasServedType,
} from '@/payload-types'
import { Media } from '@/components/Media'

type Props = FooterType

export const FooterContent: React.FC<Props> = ({
  logo,
  practiceAreaLinks,
  areasServed,
  quickLinks,
  phone,
  fax,
  address,
  socialLinks,
  copyrightText,
  allRightsReservedText,
  privacyPolicyPage,
  privacyPolicyLabel,
  legalMarketingText,
  legalMarketingUrl,
}) => {
  const resolvedPracticeAreas = (practiceAreaLinks || []).filter(
    (item): item is PracticeArea => typeof item === 'object' && item !== null,
  )

  const resolvedAreasServed = (areasServed || []).filter(
    (item): item is AreasServedType => typeof item === 'object' && item !== null,
  )

  const resolvedQuickLinks = (quickLinks || []).filter(
    (item): item is Page => typeof item === 'object' && item !== null,
  )

  const resolvedPrivacyPage =
    typeof privacyPolicyPage === 'object' && privacyPolicyPage !== null ? privacyPolicyPage : null

  const getUrl = (item: { slug?: string | null; breadcrumbs?: { url?: string | null }[] | null }) => {
    const lastCrumb = item.breadcrumbs?.at(-1)
    return lastCrumb?.url ?? `/${item.slug}`
  }

  const logoEl =
    typeof logo === 'object' && logo !== null ? (
      <Link href="/" className="block shrink-0">
        <Media resource={logo} className="[&_svg]:w-51.75 [&_svg]:h-auto" />
      </Link>
    ) : null


  const linkClass =
    'text-body font-medium text-navy-200 tracking-[-0.34px] hover:text-white transition-colors'
  const headingClass = 'text-body font-medium text-white tracking-[-0.34px]'

  const contactItems = (
    <div className="flex flex-col gap-3">
      {phone?.label && phone?.url && (
        <a href={phone.url} className={`flex items-center gap-2.5 ${linkClass}`}>
          {typeof phone.image === 'object' && phone.image !== null && (
            <Media resource={phone.image} className="shrink-0 size-6 [&_svg]:w-6 [&_svg]:h-6" />
          )}
          {phone.label}
        </a>
      )}
      {fax?.label && fax?.url && (
        <a href={fax.url} className={`flex items-center gap-2.5 ${linkClass}`}>
          {typeof fax.image === 'object' && fax.image !== null && (
            <Media resource={fax.image} className="shrink-0 size-6 [&_svg]:w-6 [&_svg]:h-6" />
          )}
          {fax.label}
        </a>
      )}
      {address?.text && (
        <div className="mt-1">
          {address.mapUrl ? (
            <a
              href={address.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} leading-normal`}
            >
              {address.text}
            </a>
          ) : (
            <p className="text-body font-medium text-navy-200 tracking-[-0.34px] leading-normal">
              {address.text}
            </p>
          )}
        </div>
      )}
      {socialLinks && socialLinks.length > 0 && (
        <div className="flex gap-4 mt-2">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="relative block size-7 shrink-0 transition-opacity hover:opacity-80 overflow-clip"
            >
              {typeof social.image === 'object' && social.image !== null && (
                <Media resource={social.image} fill imgClassName="object-contain" />
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <footer className="w-full bg-dark-blue">
      <div className="container mx-auto px-5 md:px-8 2xl:px-0 pt-15 pb-8 md:pt-16 md:pb-10">

        {/* ===== MOBILE layout (< 768px) ===== */}
        <div className="md:hidden space-y-10">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10">
            {/* Practice Areas */}
            <div className="flex flex-col gap-5">
              <h4 className={headingClass}>Practice Areas</h4>
              <ul className="flex flex-col gap-3.75">
                {resolvedPracticeAreas.map((area) => (
                  <li key={area.id}>
                    <Link href={getUrl(area)} className={linkClass}>
                      {area.general?.alternativeTitle || area.title}
                    </Link>
                  </li>
                ))}
                {resolvedPracticeAreas.length > 0 && (
                  <li>
                    <Link href="/practice-areas" className={linkClass}>
                      View All
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Areas Served */}
            <div className="flex flex-col gap-5">
              <h4 className={headingClass}>Areas Served</h4>
              <ul className="flex flex-col gap-3.75">
                {resolvedAreasServed.map((area) => (
                  <li key={area.id}>
                    <Link href={getUrl(area)} className={linkClass}>
                      {area.general?.alternativeTitle || area.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div className="flex flex-col gap-5">
              <h4 className={headingClass}>Information</h4>
              <ul className="flex flex-col gap-3.75">
                {resolvedQuickLinks.map((page) => (
                  <li key={page.id}>
                    <Link href={getUrl(page)} className={linkClass}>
                      {page.general?.alternativeTitle || page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-5">
              <h4 className={headingClass}>Contact</h4>
              {contactItems}
            </div>
          </div>

          {/* Logo at bottom on mobile */}
          {logoEl}
        </div>

        {/* ===== TABLET layout (768px–1023px) ===== */}
        <div className="hidden md:grid lg:hidden grid-cols-[2fr_1fr_1fr] gap-8">
          {/* Col 1: Logo + Contact + Social */}
          <div className="flex flex-col gap-8 max-w-57.5">
            {logoEl}
            <div className="flex flex-col gap-5">
              <h4 className={headingClass}>Contact</h4>
              {contactItems}
            </div>
          </div>

          {/* Col 2: Information + Practice Areas */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-5">
              <h4 className={headingClass}>Information</h4>
              <ul className="flex flex-col gap-2.5">
                {resolvedQuickLinks.map((page) => (
                  <li key={page.id}>
                    <Link href={getUrl(page)} className={linkClass}>
                      {page.general?.alternativeTitle || page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-5">
              <h4 className={headingClass}>Practice Areas</h4>
              <ul className="flex flex-col gap-2.5">
                {resolvedPracticeAreas.map((area) => (
                  <li key={area.id}>
                    <Link href={getUrl(area)} className={linkClass}>
                      {area.general?.alternativeTitle || area.title}
                    </Link>
                  </li>
                ))}
                {resolvedPracticeAreas.length > 0 && (
                  <li>
                    <Link href="/practice-areas" className={linkClass}>
                      View All
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Col 3: Areas Served */}
          <div className="flex flex-col gap-5">
            <h4 className={headingClass}>Areas Served</h4>
            <ul className="flex flex-col gap-2.5">
              {resolvedAreasServed.map((area) => (
                <li key={area.id}>
                  <Link href={getUrl(area)} className={linkClass}>
                    {area.general?.alternativeTitle || area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ===== DESKTOP layout (1024px+) ===== */}
        <div className="hidden lg:grid lg:grid-cols-[235fr_235fr_190fr_280fr_165fr] lg:gap-8 items-start">
          {/* Logo */}
          <div>{logoEl}</div>

          {/* Practice Areas */}
          <div className="flex flex-col gap-5">
            <h4 className={headingClass}>Practice Areas</h4>
            <ul className="flex flex-col gap-3.75">
              {resolvedPracticeAreas.map((area) => (
                <li key={area.id}>
                  <Link href={getUrl(area)} className={linkClass}>
                    {area.general?.alternativeTitle || area.title}
                  </Link>
                </li>
              ))}
              {resolvedPracticeAreas.length > 0 && (
                <li>
                  <Link href="/practice-areas" className={linkClass}>
                    View All
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-5">
            <h4 className={headingClass}>Quick Links</h4>
            <ul className="flex flex-col gap-3.75">
              {resolvedQuickLinks.map((page) => (
                <li key={page.id}>
                  <Link href={getUrl(page)} className={linkClass}>
                    {page.general?.alternativeTitle || page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas Served */}
          <div className="flex flex-col gap-5">
            <h4 className={headingClass}>Areas Served</h4>
            <ul className="flex flex-col gap-3.75">
              {resolvedAreasServed.map((area) => (
                <li key={area.id}>
                  <Link href={getUrl(area)} className={linkClass}>
                    {area.general?.alternativeTitle || area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-5">
            <h4 className={headingClass}>Contact</h4>
            {contactItems}
          </div>
        </div>

        {/* ===== Divider + Copyright (all breakpoints) ===== */}
        <div className="mt-10 md:mt-14">
          <hr className="border-white/10" />
          <div className="mt-4 md:text-center">
            <p className="text-body-sm text-navy-200 tracking-[-0.28px] leading-5.5">
              {copyrightText && (
                <>
                  Copyright&copy; {new Date().getFullYear()} {copyrightText}
                </>
              )}
              {allRightsReservedText && <>{' | '}{allRightsReservedText}</>}
              {resolvedPrivacyPage && privacyPolicyLabel && (
                <>
                  {' | '}
                  <Link
                    href={getUrl(resolvedPrivacyPage)}
                    className="underline hover:text-white transition-colors"
                  >
                    {privacyPolicyLabel}
                  </Link>
                </>
              )}
              {legalMarketingText && (
                <>
                  {' | '}
                  {legalMarketingUrl ? (
                    <a
                      href={legalMarketingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      {legalMarketingText}
                    </a>
                  ) : (
                    legalMarketingText
                  )}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
