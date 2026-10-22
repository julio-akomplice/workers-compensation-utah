import React from 'react'
import { Header } from '@/Header/Component'
import { Footer } from '@/Footer/Component'
import { SiteSchema } from '@/components/SchemaMarkup'

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteSchema />
      <Header />
      <main className="flex-1 mt-header navbar:mt-0">{children}</main>
      <Footer />
    </div>
  )
}
