'use client'

import React, { createContext, useCallback, use, useState } from 'react'

export interface PageInfo {
  id?: string | number | null
  collectionSlug?: string | null
}

export interface ContextType {
  pageInfo: PageInfo
  setPageInfo: (info: PageInfo) => void
}

const initialContext: ContextType = {
  pageInfo: {},
  setPageInfo: () => null,
}

const PageInfoContext = createContext(initialContext)

export const PageInfoProvider = ({ children }: { children: React.ReactNode }) => {
  const [pageInfo, setPageInfoState] = useState<PageInfo>({})

  const setPageInfo = useCallback((info: PageInfo) => {
    setPageInfoState(info)
  }, [])

  return <PageInfoContext value={{ pageInfo, setPageInfo }}>{children}</PageInfoContext>
}

export const usePageInfo = (): ContextType => use(PageInfoContext)
