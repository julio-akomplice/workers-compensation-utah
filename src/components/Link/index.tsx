import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { AreasServed, Page, Post, PracticeArea } from '@/payload-types'
import { ArrowIcon } from '../ui/ArrowIcon'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts' | 'practice-areas' | 'areas-served'
    value: Page | Post | PracticeArea | AreasServed | string | number
  } | null
  showArrow?: boolean | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    showArrow,
    size,
    url,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  const arrow = showArrow ? (
    <ArrowIcon className="transition-all duration-200 group-hover/cta-button:translate-x-0.75" />
  ) : null

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn('group/cta-button', className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
        {arrow}
      </Link>
    )
  }

  return (
    <Button asChild className={className} variant={appearance}>
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
        {arrow}
      </Link>
    </Button>
  )
}
