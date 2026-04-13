'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

interface PageClientProps {
  solidMenu?: boolean
}

const PageClient: React.FC<PageClientProps> = ({ solidMenu = false }) => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme, setSolidMenu } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  useEffect(() => {
    setSolidMenu(solidMenu)
  }, [solidMenu, setSolidMenu])

  return <React.Fragment />
}

export default PageClient
