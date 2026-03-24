'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'

import type { Header, Page, Post } from '@/payload-types'

import { Media } from '@/components/Media'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
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

  const navItems = data?.navItems || []
  const logo = data?.logo
  const phone = data?.phone

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-20 transition-colors duration-300 ${
        scrolled ? 'bg-dark-blue' : ''
      }`}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      {/* Dark gradient overlay — only when not scrolled */}
      {!scrolled && (
        <div className="absolute inset-0 h-[92px] bg-gradient-to-b from-off-black/40 to-transparent pointer-events-none" />
      )}

      <div className="container relative">
        <div className="flex items-center justify-between py-[22px]">
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

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(({ link }, i) => {
              const href =
                link.type === 'reference' &&
                typeof link.reference?.value === 'object' &&
                (link.reference.value as Page | Post).slug
                  ? `/${(link.reference.value as Page | Post).slug}`
                  : link.url || '#'

              return (
                <Link
                  key={i}
                  href={href}
                  className="text-white text-body-lg tracking-[-0.36px] hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Phone CTA */}
          {phone?.label && phone?.url && (
            <a
              href={phone.url}
              className="hidden md:flex items-center gap-2.5 px-5 py-3 rounded-lg bg-gradient-brand text-white text-cta-secondary tracking-[-0.4px] shadow-[inset_0px_-3px_7px_0px_var(--gold)] hover:opacity-90 transition-opacity"
            >
              <Phone className="w-5 h-5 shrink-0" strokeWidth={2} />
              <span>{phone.label}</span>
            </a>
          )}
        </div>
      </div>

      {/* Bottom separator line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </header>
  )
}
