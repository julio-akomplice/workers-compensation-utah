import React from 'react'
import { LandingNavbar } from '@/components/LandingNavbar'
import { LandingFooter } from '@/components/LandingFooter'
import { SiteSchema } from '@/components/SchemaMarkup'

export const LandingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteSchema />
      <LandingNavbar />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  )
}
