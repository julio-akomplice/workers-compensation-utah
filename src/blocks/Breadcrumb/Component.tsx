import React from 'react'

import type { BreadcrumbBlock as BreadcrumbBlockProps, Page } from 'src/payload-types'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/Breadcrumbs'

type Props = {
  className?: string
} & BreadcrumbBlockProps

export const BreadcrumbBlock: React.FC<Props> = ({ theme, pages }) => {
  const items: BreadcrumbItem[] = (pages || []).map((page, index) => {
    const pageData = page as Page
    const isLast = index === (pages?.length ?? 0) - 1

    return {
      label: pageData.title,
      href: isLast ? undefined : `/${pageData.slug}`,
    }
  })

  return <Breadcrumbs items={items} theme={theme ?? undefined} />
}
