'use client'

import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar'

import { cn } from '@/utilities/ui'
import { useSelectedLayoutSegments } from 'next/navigation'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import './index.scss'

import { getClientSideURL } from '@/utilities/getURL'
import { usePageInfo } from '@/providers/PageInfo'

const baseClass = 'admin-bar'

const collectionLabels = {
  pages: {
    plural: 'Pages',
    singular: 'Page',
  },
  posts: {
    plural: 'Posts',
    singular: 'Post',
  },
  projects: {
    plural: 'Projects',
    singular: 'Project',
  },
}

const Title: React.FC = () => <span>Dashboard</span>

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = (props) => {
  const { adminBarProps } = props || {}
  const segments = useSelectedLayoutSegments()
  const [show, setShow] = useState(false)
  const collection = (
    collectionLabels[segments?.[1] as keyof typeof collectionLabels] ? segments[1] : 'pages'
  ) as keyof typeof collectionLabels
  const router = useRouter()

  const { pageInfo } = usePageInfo()
  const barRef = React.useRef<HTMLDivElement>(null)

  const onAuthChange = React.useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id))
  }, [])

  React.useEffect(() => {
    if (!show) {
      document.documentElement.style.setProperty('--admin-bar-height', '0px')
      return
    }
    // rAF ensures the element is painted at its final size before measuring
    const raf = requestAnimationFrame(() => {
      const height = barRef.current ? barRef.current.offsetHeight : 0
      document.documentElement.style.setProperty('--admin-bar-height', `${height}px`)
    })
    return () => cancelAnimationFrame(raf)
  }, [show])

  return (
    <div
      ref={barRef}
      className={cn(baseClass, 'sticky top-0 z-30 py-2 bg-black text-white', {
        block: show,
        hidden: !show,
      })}
    >
      <div className="container">
        <PayloadAdminBar
          {...adminBarProps}
          className="py-2 text-white"
          classNames={{
            controls: 'font-medium text-white',
            logo: 'text-white',
            user: 'text-white',
          }}
          cmsURL={getClientSideURL()}
          id={pageInfo.id ? String(pageInfo.id) : undefined}
          collectionSlug={(pageInfo.collectionSlug ?? collection) as keyof typeof collectionLabels}
          collectionLabels={{
            plural: collectionLabels[(pageInfo.collectionSlug ?? collection) as keyof typeof collectionLabels]?.plural || 'Pages',
            singular: collectionLabels[(pageInfo.collectionSlug ?? collection) as keyof typeof collectionLabels]?.singular || 'Page',
          }}
          logo={<Title />}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            fetch('/next/exit-preview').then(() => {
              router.push('/')
              router.refresh()
            })
          }}
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            position: 'relative',
            zIndex: 'unset',
          }}
        />
      </div>
    </div>
  )
}
