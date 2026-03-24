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

  return (
    <footer className="w-full bg-dark-blue">
      <div className="container mx-auto px-4 pt-12 pb-6 lg:pt-12 lg:pb-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[200px_1fr_1fr_1fr_1fr] lg:gap-8">
          {/* Logo Column */}
          <div className="flex items-start">
            <Link href="/">
              {typeof logo === 'object' && logo !== null ? (
                <Media resource={logo} className="[&_svg]:max-w-50 [&_svg]:w-full h-auto" />
              ) : null}
            </Link>
          </div>

          {/* Practice Areas Column */}
          <div>
            <h4 className="text-body font-medium text-white mb-6 tracking-[-0.32px]">
              Practice Areas
            </h4>
            <ul className="flex flex-col gap-3">
              {resolvedPracticeAreas.map((area) => (
                <li key={area.id}>
                  <Link
                    href={`/practice-areas/${area.slug}`}
                    className="text-body font-medium text-navy-200 tracking-[-0.32px] hover:text-white transition-colors"
                  >
                    {area.general?.alternativeTitle || area.title}
                  </Link>
                </li>
              ))}
              {resolvedPracticeAreas.length > 0 && (
                <li>
                  <Link
                    href="/practice-areas"
                    className="text-body font-medium text-navy-200 tracking-[-0.32px] hover:text-white transition-colors"
                  >
                    View All
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Areas Served Column */}
          <div>
            <h4 className="text-body font-medium text-white mb-6 tracking-[-0.32px]">
              Areas Served
            </h4>
            <ul className="flex flex-col gap-3">
              {resolvedAreasServed.map((area) => (
                <li key={area.id}>
                  <Link
                    href={`/areas-served/${area.slug}`}
                    className="text-body font-medium text-navy-200 tracking-[-0.32px] hover:text-white transition-colors"
                  >
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-body font-medium text-white mb-6 tracking-[-0.32px]">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {resolvedQuickLinks.map((page) => (
                <li key={page.id}>
                  <Link
                    href={`/${page.slug}`}
                    className="text-body font-medium text-navy-200 tracking-[-0.32px] hover:text-white transition-colors"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-body font-medium text-white mb-6 tracking-[-0.32px]">Contact</h4>
            <div className="flex flex-col gap-3">
              {/* Phone */}
              {phone?.label && phone?.url && (
                <a
                  href={phone.url}
                  className="flex items-center gap-2.5 text-body font-medium text-navy-200 tracking-[-0.32px] hover:text-white transition-colors"
                >
                  {typeof phone.image === 'object' && phone.image !== null && (
                    <span className="relative shrink-0 size-6">
                      <Media
                        resource={phone.image}
                        fill
                        className="object-contain [&_svg]:w-full [&_svg]:h-full"
                      />
                    </span>
                  )}
                  {phone.label}
                </a>
              )}

              {/* Fax */}
              {fax?.label && fax?.url && (
                <a
                  href={fax.url}
                  className="flex items-center gap-2.5 text-body font-medium text-navy-200 tracking-[-0.32px] hover:text-white transition-colors"
                >
                  {typeof fax.image === 'object' && fax.image !== null && (
                    <span className="relative shrink-0 size-6">
                      <Media
                        resource={fax.image}
                        fill
                        className="object-contain [&_svg]:w-full [&_svg]:h-full"
                      />
                    </span>
                  )}
                  {fax.label}
                </a>
              )}

              {/* Address */}
              {address?.text && (
                <div className="mt-2">
                  {address.mapUrl ? (
                    <a
                      href={address.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body font-medium text-navy-200 tracking-[-0.32px] hover:text-white transition-colors leading-normal"
                    >
                      {address.text}
                    </a>
                  ) : (
                    <p className="text-body font-medium text-navy-200 tracking-[-0.32px] leading-normal">
                      {address.text}
                    </p>
                  )}
                </div>
              )}

              {/* Social Icons */}
              {socialLinks && socialLinks.length > 0 && (
                <div className="flex gap-3 mt-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="relative block size-9 shrink-0 transition-opacity hover:opacity-80 overflow-clip"
                    >
                      {typeof social.image === 'object' && social.image !== null && (
                        <Media resource={social.image} fill imgClassName="object-contain" />
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-navy-800 mt-10 mb-6" />

        {/* Bottom Section */}
        <div className="text-body-sm text-navy-200 text-center tracking-[-0.28px]">
          <p>
            {copyrightText && (
              <>
                Copyright&copy; {new Date().getFullYear()} {copyrightText}
              </>
            )}
            {allRightsReservedText && (
              <>
                {' | '}
                {allRightsReservedText}
              </>
            )}
            {resolvedPrivacyPage && privacyPolicyLabel && (
              <>
                {' | '}
                <Link
                  href={`/${resolvedPrivacyPage.slug}`}
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
    </footer>
  )
}
