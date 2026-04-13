import type { Metadata } from 'next'
import React from 'react'

import { draftMode } from 'next/headers'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { generateMeta } from '@/utilities/generateMeta'

import { getPageStaticParams } from './PageTemplate/queries'
import { resolvePageComponent, resolvePageMetadata } from './PageTemplate'
import { getPracticeAreaStaticParams } from './PracticeAreaTemplate/queries'
import { resolvePracticeAreaComponent, resolvePracticeAreaMetadata } from './PracticeAreaTemplate'
import { getAreaServedStaticParams } from './AreaServedTemplate/queries'
import { resolveAreaServedComponent, resolveAreaServedMetadata } from './AreaServedTemplate'

export async function generateStaticParams() {
  const [pageParams, practiceAreaParams, areasServedParams] = await Promise.all([
    getPageStaticParams(),
    getPracticeAreaStaticParams(),
    getAreaServedStaticParams(),
  ])
  return [...pageParams, ...practiceAreaParams, ...areasServedParams]
}

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = ['home'] } = await paramsPromise
  const decodedSlug = slug.map(decodeURIComponent)
  const url = '/' + decodedSlug.join('/')

  if (decodedSlug.length === 1) {
    const flatSlug = decodedSlug[0]!

    const pageResult = await resolvePageComponent(flatSlug, url, draft)
    if (pageResult) return pageResult

    const practiceResult = await resolvePracticeAreaComponent(flatSlug, url, draft)
    if (practiceResult) return practiceResult
  }

  const areaResult = await resolveAreaServedComponent(decodedSlug, url, draft)
  if (areaResult) return areaResult

  return <PayloadRedirects url={url} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = ['home'] } = await paramsPromise
  const decodedSlug = slug.map(decodeURIComponent)

  if (decodedSlug.length === 1) {
    const flatSlug = decodedSlug[0]!

    const pageMeta = await resolvePageMetadata(flatSlug)
    if (pageMeta) return pageMeta

    const practiceMeta = await resolvePracticeAreaMetadata(flatSlug)
    if (practiceMeta) return practiceMeta
  }

  const areaMeta = await resolveAreaServedMetadata(decodedSlug)
  if (areaMeta) return areaMeta

  return generateMeta({ doc: null })
}
