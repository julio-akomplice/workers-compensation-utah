'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

const PageClient: React.FC = () => {
  const { setHeaderTheme, setSolidMenu } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
    // setSolidMenu(true)
  }, [setHeaderTheme, setSolidMenu])

  return <React.Fragment />
}

export default PageClient
