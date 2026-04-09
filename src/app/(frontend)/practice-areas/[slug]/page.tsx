import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Page } from '@/payload-types'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { CaseQuestionnaireCTABlockComponent } from '@/blocks/CaseQuestionnaireCTABlock/Component'
import { ContactSectionBlockComponent } from '@/blocks/ContactSectionBlock/Component'
import { FAQSectionBlockComponent } from '@/blocks/FAQSection/Component'
import { ArticlesSectionBlock } from '@/blocks/ArticlesSection/Component'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const practiceAreas = await payload.find({
    collection: 'practice-areas',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return practiceAreas.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function PracticeAreaPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/practice-areas/' + decodedSlug

  const practiceArea = await queryPracticeAreaBySlug({ slug: decodedSlug })

  if (!practiceArea) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = practiceArea

  return (
    <article>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout as Page['layout'][0][]} />

      {/* @ts-expect-error global sections don't need block props */}
      <CaseQuestionnaireCTABlockComponent />
      {/* @ts-expect-error global sections don't need block props */}
      <ContactSectionBlockComponent />
      {/* @ts-expect-error global sections don't need block props */}
      <FAQSectionBlockComponent />
      {/* @ts-expect-error global sections don't need block props */}
      <ArticlesSectionBlock />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const practiceArea = await queryPracticeAreaBySlug({ slug: decodedSlug })

  return generateMeta({ doc: practiceArea })
}

const queryPracticeAreaBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'practice-areas',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
