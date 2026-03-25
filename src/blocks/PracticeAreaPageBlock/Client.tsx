'use client'

import React from 'react'

import type { Form as FormType, ShortSideForm as ShortSideFormType } from '@/payload-types'
import { TableOfContents } from '@/components/TableOfContents'
import { ShortSideForm } from '@/components/ShortSideForm'

type CategoryInfo = {
  id: string
  title: string
  slug: string
}

type Props = {
  categorySections: CategoryInfo[]
  form: FormType | null
  header?: ShortSideFormType['header']
  children: React.ReactNode
}

export const PracticeAreaPageClient: React.FC<Props> = ({
  categorySections,
  form,
  header,
  children,
}) => {
  const tocItems = categorySections.map((section) => ({
    id: `category-${section.slug}`,
    label: section.title,
  }))

  return (
    <div className="lg:flex lg:gap-10 xl:gap-16">
      {/* Table of Contents - Desktop only */}
      <div className="hidden lg:block lg:w-[176px] lg:shrink-0">
        <div className="sticky top-[120px]">
          <TableOfContents items={tocItems} />
        </div>
      </div>

      {/* Main Content */}
      <div className="min-w-0 flex-1">{children}</div>

      {/* Short Side Form - Desktop only */}
      {form && (
        <div className="hidden lg:block lg:w-[316px] lg:shrink-0">
          <div className="sticky top-[120px]">
            <ShortSideForm form={form} header={header} />
          </div>
        </div>
      )}
    </div>
  )
}
