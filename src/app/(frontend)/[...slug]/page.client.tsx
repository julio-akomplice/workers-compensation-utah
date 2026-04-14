'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePageInfo } from '@/providers/PageInfo'
import React, { useEffect } from 'react'

interface PageClientProps {
  solidMenu?: boolean
  docId?: string | number | null
  collectionSlug?: string | null
}

const PageClient: React.FC<PageClientProps> = ({ solidMenu = false, docId, collectionSlug }) => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme, setSolidMenu } = useHeaderTheme()
  const { setPageInfo } = usePageInfo()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  useEffect(() => {
    setSolidMenu(solidMenu)
  }, [solidMenu, setSolidMenu])

  useEffect(() => {
    setPageInfo({ id: docId ?? null, collectionSlug: collectionSlug ?? null })
  }, [docId, collectionSlug, setPageInfo])

  return <React.Fragment />
}

export default PageClient
