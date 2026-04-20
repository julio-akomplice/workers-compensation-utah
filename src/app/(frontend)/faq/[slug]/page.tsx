import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Faq, Template } from '@/payload-types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { SchemaMarkup } from '@/components/SchemaMarkup'
import RichText from '@/components/RichText'
import { ContentWithSidebar } from '@/components/ContentWithSidebar'
import { getShortSideForm } from '@/utilities/getShortSideForm'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const faqs = await payload.find({
    collection: 'faq',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return faqs.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function IndividualFAQPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/faq/' + decodedSlug
  const faq = await queryFAQBySlug({ slug: decodedSlug })

  if (!faq) return <PayloadRedirects url={url} />

  const { form, header } = await getShortSideForm()
  const template = await queryTemplate({ templateType: 'faq' })

  const { question, answer } = faq

  return (
    <article>
      <SchemaMarkup schema={faq.meta?.schema} />
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {template?.hero && <RenderHero {...template.hero} />}

      <Breadcrumbs
        items={[
          { label: 'FAQS', href: '/faq' },
          { label: question },
        ]}
      />

      {answer && (
        <section className="w-full bg-white">
          <div className="container mx-auto px-5 md:px-8 2xl:px-0">
            <div className="pb-16 pt-8 md:pb-20 md:pt-12 lg:pt-16">
              <ContentWithSidebar form={form} header={header}>
                <div>
                  <h1 className="mb-6 text-[28px] font-semibold leading-[32px] tracking-[-0.03em] text-dark-blue md:text-[36px] md:leading-[40px] lg:text-[40px] lg:leading-[44px]">
                    {question}
                  </h1>
                  <RichText
                    className="richtext"
                    data={answer}
                    enableGutter={false}
                    enableProse={false}
                  />
                </div>
              </ContentWithSidebar>
            </div>
          </div>
        </section>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const faq = await queryFAQBySlug({ slug: decodedSlug })

  return generateMeta({ doc: faq })
}

const queryFAQBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'faq',
    depth: 2,
    draft,
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

const queryTemplate = cache(async ({ templateType }: { templateType: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'templates',
    depth: 2,
    limit: 1,
    pagination: false,
    where: {
      templateType: {
        equals: templateType,
      },
    },
  })

  return result.docs?.[0] || null
})

