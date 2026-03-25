'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { Phone, X } from 'lucide-react'

import type { Header, Page, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  data: Header
  initialSolidMenu?: boolean
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, initialSolidMenu = false }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme, solidMenu: contextSolidMenu } = useHeaderTheme()
  // Use context value once hydrated, fall back to server-provided initial value
  const solidMenu = contextSolidMenu || initialSolidMenu
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const navItems = data?.navItems || []
  const logo = data?.logo
  const phone = data?.phone

  const getHref = useCallback(
    (link: (typeof navItems)[number]['link']) => {
      return link.type === 'reference' &&
        typeof link.reference?.value === 'object' &&
        (link.reference.value as Page | Post).slug
        ? `/${(link.reference.value as Page | Post).slug}`
        : link.url || '#'
    },
    [],
  )

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-20',
        solidMenu && 'bg-dark-blue',
        !solidMenu && 'transition-colors duration-300',
        !solidMenu && scrolled && 'bg-dark-blue',
      )}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      {/* Dark gradient overlay — only when not scrolled and not solid menu */}
      {!scrolled && !solidMenu && (
        <div className="absolute inset-0 h-[88px] md:h-[92px] bg-gradient-to-b from-off-black/40 to-transparent pointer-events-none" />
      )}

      <div className="container relative">
        <div className="flex items-center justify-between py-5 md:py-[22px]">
          {/* Logo */}
          <Link href="/" className="relative z-10 shrink-0">
            {logo ? (
              <Media
                resource={logo}
                className="[&_svg]:h-[48px] [&_svg]:w-[147px]"
                loading="eager"
                priority
                size="147px"
              />
            ) : (
              <span className="text-white text-xl font-medium">WCU</span>
            )}
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map(({ link }, i) => (
              <Link
                key={i}
                href={getHref(link)}
                className="text-white text-body-lg tracking-[-0.36px] hover:opacity-80 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Phone CTA */}
          {phone?.label && phone?.url && (
            <a
              href={phone.url}
              className="hidden lg:flex items-center gap-2.5 px-5 py-3 rounded-lg bg-gradient-brand text-white text-cta-secondary tracking-[-0.4px] shadow-[inset_0px_-3px_7px_0px_var(--gold)] hover:opacity-90 transition-opacity"
            >
              <Phone className="w-5 h-5 shrink-0" strokeWidth={2} />
              <span>{phone.label}</span>
            </a>
          )}

          {/* Mobile/Tablet Hamburger */}
          <button
            className="relative z-10 lg:hidden flex items-center justify-center size-11 cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
            >
              <mask
                id="mask0_menu"
                style={{ maskType: 'alpha' }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="44"
                height="44"
              >
                <rect width="44" height="44" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_menu)">
                <path
                  d="M7.79102 33.2536C7.40143 33.2536 7.07495 33.1026 6.81156 32.8004C6.54786 32.4986 6.41602 32.1243 6.41602 31.6775C6.41602 31.2311 6.54786 30.857 6.81156 30.5552C7.07495 30.2537 7.40143 30.103 7.79102 30.103H36.2077C36.5973 30.103 36.9237 30.2539 37.1871 30.5557C37.4508 30.8579 37.5827 31.2323 37.5827 31.6791C37.5827 32.1255 37.4508 32.4996 37.1871 32.8014C36.9237 33.1029 36.5973 33.2536 36.2077 33.2536H7.79102ZM7.79102 22.9924C7.40143 22.9924 7.07495 22.8414 6.81156 22.5392C6.54786 22.237 6.41602 21.8627 6.41602 21.4163C6.41602 20.9696 6.54786 20.5955 6.81156 20.294C7.07495 19.9922 7.40143 19.8413 7.79102 19.8413H36.2077C36.5973 19.8413 36.9237 19.9924 37.1871 20.2945C37.4508 20.5967 37.5827 20.971 37.5827 21.4174C37.5827 21.8641 37.4508 22.2383 37.1871 22.5397C36.9237 22.8415 36.5973 22.9924 36.2077 22.9924H7.79102ZM7.79102 12.7307C7.40143 12.7307 7.07495 12.5798 6.81156 12.278C6.54786 11.9758 6.41602 11.6014 6.41602 11.1546C6.41602 10.7082 6.54786 10.3341 6.81156 10.0323C7.07495 9.73081 7.40143 9.58008 7.79102 9.58008H36.2077C36.5973 9.58008 36.9237 9.73116 37.1871 10.0333C37.4508 10.3351 37.5827 10.7094 37.5827 11.1562C37.5827 11.6026 37.4508 11.9767 37.1871 12.2785C36.9237 12.58 36.5973 12.7307 36.2077 12.7307H7.79102Z"
                  fill="white"
                />
              </g>
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom separator line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Mobile/Tablet Slide-out Drawer */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 z-50 bg-white transition-transform duration-300 ease-in-out w-[370px] max-w-[95vw] md:w-[474px] ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-[22px] right-5 md:right-[32px] size-11 flex items-center justify-center text-navy-200"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <X className="size-7" strokeWidth={1.5} />
        </button>

        {/* Nav Links */}
        <nav className="flex flex-col mt-[61px] md:mt-[92px] px-8 md:px-12 gap-[30px] md:gap-[30px]">
          {navItems.map(({ link }, i) => (
            <Link
              key={i}
              href={getHref(link)}
              onClick={() => setMobileMenuOpen(false)}
              className="text-off-black font-medium text-[32px] leading-[36px] tracking-[-0.96px] md:text-[50px] md:leading-[55px] md:tracking-[-2px] hover:opacity-70 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Phone CTA at bottom */}
        {phone?.label && phone?.url && (
          <a
            href={phone.url}
            className="absolute bottom-[40px] md:bottom-[88px] left-1/2 -translate-x-1/2 flex items-center justify-center gap-2.5 px-5 py-3 rounded-lg bg-gradient-brand text-white text-cta-secondary tracking-[-0.4px] shadow-[inset_0px_-3px_7px_0px_var(--gold)] hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Phone className="w-5 h-5 shrink-0" strokeWidth={2} />
            <span>{phone.label}</span>
          </a>
        )}
      </div>
    </header>
  )
}
