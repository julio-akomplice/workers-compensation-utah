'use client'

import React, { useRef, useEffect, useState } from 'react'

import type { Form as FormType, ShortSideForm as ShortSideFormType } from '@/payload-types'
import { TableOfContents } from '@/components/TableOfContents'
import { ShortSideForm } from '@/components/ShortSideForm'

type TOCItem = {
  id: string
  label: string
}

type Props = {
  form: FormType | null
  header?: ShortSideFormType['header']
  children: React.ReactNode
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const AreasServedPageClient: React.FC<Props> = ({
  form,
  header,
  children,
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [tocItems, setTocItems] = useState<TOCItem[]>([])

  useEffect(() => {
    if (!contentRef.current) return

    const h2Elements = contentRef.current.querySelectorAll('h2')
    const items: TOCItem[] = []

    h2Elements.forEach((h2) => {
      const text = h2.textContent || ''
      const id = slugify(text)
      h2.id = id
      h2.classList.add('scroll-mt-[120px]')
      items.push({ id, label: text })
    })

    setTocItems(items)
  }, [])

  return (
    <div className="lg:flex lg:gap-10 xl:gap-16">
      {/* Table of Contents - Desktop only */}
      <div className="hidden lg:block lg:w-[176px] lg:shrink-0">
        <div className="sticky top-[120px]">
          <TableOfContents items={tocItems} />
        </div>
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="min-w-0 flex-1">
        {children}
      </div>

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
