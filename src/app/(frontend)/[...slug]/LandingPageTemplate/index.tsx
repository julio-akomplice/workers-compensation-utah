import React from 'react'

import type { Metadata } from 'next'
import type { LandingPage } from '@/payload-types'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import { SchemaMarkup } from '@/components/SchemaMarkup'
import { LandingLayout } from '@/components/LandingLayout'
import PageClient from '../page.client'
import { queryLandingPageBySlug } from './queries'

type Props = {
  page: LandingPage
  url: string
  draft: boolean
}

export const LandingPageTemplate: React.FC<Props> = ({ page, url, draft }) => {
  const { hero, layout, meta } = page

  return (
    <LandingLayout>
      <article>
        <SchemaMarkup schema={meta?.schema} />
        <PageClient docId={page.id} collectionSlug="landing-pages" />
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
        <RenderHero {...hero} />
        <RenderBlocks blocks={layout} />
      </article>
    </LandingLayout>
  )
}

export async function resolveLandingPageComponent(
  flatSlug: string,
  url: string,
  draft: boolean,
): Promise<React.ReactNode | null> {
  const page = await queryLandingPageBySlug({ slug: flatSlug })
  if (!page) return null

  return <LandingPageTemplate page={page} url={url} draft={draft} />
}

export async function resolveLandingPageMetadata(flatSlug: string): Promise<Metadata | null> {
  const page = await queryLandingPageBySlug({ slug: flatSlug })
  if (!page) return null
  return generateMeta({ doc: page })
}
