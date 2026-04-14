import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { PageInfoProvider } from './PageInfo'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <PageInfoProvider>{children}</PageInfoProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
