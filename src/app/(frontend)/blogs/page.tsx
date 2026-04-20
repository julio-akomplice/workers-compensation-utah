import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export const dynamic = 'force-static'
export const revalidate = 600

const postSlug = 'posts'

export default async function Page() {
  const { isEnabled: draft } = await draftMode()

  const page = await queryPageBySlug({ slug: postSlug })

  if (!page) {
    return <PayloadRedirects url={`/${postSlug}`} />
  }

  const { hero, layout, solidMenu } = page

  return (
    <article className={solidMenu ? 'pt-header' : ''}>
      <PageClient solidMenu={solidMenu ?? false} />
      <PayloadRedirects disableNotFound url={`/${postSlug}`} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <div className="">
        <RenderBlocks blocks={layout} />
      </div>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug({ slug: postSlug })
  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
