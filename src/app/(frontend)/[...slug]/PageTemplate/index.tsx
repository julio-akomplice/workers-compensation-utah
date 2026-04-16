import React from 'react'

import type { Metadata } from 'next'
import type { RequiredDataFromCollectionSlug } from 'payload'
import { homeStatic } from './homeStatic'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import { SchemaMarkup } from '@/components/SchemaMarkup'
import PageClient from '../page.client'
import { queryPageBySlug } from './queries'

type Props = {
  page: RequiredDataFromCollectionSlug<'pages'>
  url: string
  draft: boolean
}

export const PageTemplate: React.FC<Props> = ({ page, url, draft }) => {
  const { hero, layout, solidMenu, meta } = page

  return (
    <article className={solidMenu ? 'pt-header' : ''}>
      <SchemaMarkup schema={meta?.schema} />
      <PageClient solidMenu={solidMenu ?? false} docId={page.id} collectionSlug="pages" />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function resolvePageComponent(
  flatSlug: string,
  url: string,
  draft: boolean,
): Promise<React.ReactNode | null> {
  let page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({
    slug: flatSlug,
  })


  if (!page && flatSlug === 'home') {
    page = homeStatic as RequiredDataFromCollectionSlug<'pages'>
  }

  if (!page || page.excludeFromSlugRoute) return null

  return <PageTemplate page={page} url={url} draft={draft} />
}

export async function resolvePageMetadata(flatSlug: string): Promise<Metadata | null> {
  const page = await queryPageBySlug({ slug: flatSlug })
  if (!page || page.excludeFromSlugRoute) return null
  return generateMeta({ doc: page })
}
