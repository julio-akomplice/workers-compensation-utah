import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import Link from 'next/link'

import type { Faq, Template } from '@/payload-types'

import { Media } from '@/components/Media'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import RichText from '@/components/RichText'
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

  const template = await queryTemplate({ templateType: 'faq' })

  const { question, image, answer } = faq

  return (
    <article className="lg:pt-header">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* Hero from Template — tablet & mobile only */}
      {template?.hero && <RenderHero {...template.hero} />}

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'FAQS', href: '/faq' },
          { label: question },
        ]}
      />

      {/* Back Link */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-5 md:px-8 lg:px-4">
          <div className="pt-6 md:pt-8">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1 font-medium tracking-[-0.02em] text-navy-500 hover:text-navy-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="rotate-180"
              >
                <mask
                  id="mask0_arrow"
                  style={{ maskType: 'alpha' }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                >
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_arrow)">
                  <path
                    d="M14 18L12.6 16.55L16.15 13H4V11H16.15L12.6 7.45L14 6L20 12L14 18Z"
                    fill="currentColor"
                  />
                </g>
              </svg>
              <span>View all FAQS</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-5 md:px-8 lg:px-4">
          <div className="py-8 md:py-10 lg:py-[60px]">
            {/* Desktop/Tablet: Side by side | Mobile: Stacked */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-[30px] lg:gap-[56px]">
              {/* Image */}
              {image && typeof image === 'object' && (
                <div className="w-full aspect-video md:w-[278px] md:shrink-0 md:aspect-[278/358] lg:w-[478px] lg:aspect-video overflow-hidden rounded-[10px]">
                  <Media
                    resource={image}
                    imgClassName="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Text Content */}
              <div className="mt-4 md:mt-0 flex flex-col gap-3 md:gap-[25px] md:flex-1 md:py-10">
                {/* Category Tag - Tablet & Mobile only */}
                <span className="inline-flex w-fit items-center justify-center rounded-full border border-navy-100 px-[10px] py-[2px] text-body font-medium tracking-[-0.02em] text-navy-300 lg:hidden">
                  FAQS
                </span>

                {/* Question */}
                <h1 className="text-[20px] font-semibold leading-[24px] tracking-[-0.03em] text-dark-blue md:text-[32px] md:leading-[36px] md:tracking-[-0.03em]">
                  {question}
                </h1>

                {/* Answer — on desktop, shown inline next to image */}
                {answer && (
                  <div className="hidden md:block">
                    <RichText
                      className="richtext text-body leading-[24px] tracking-[-0.02em] text-deep-blue-900"
                      data={answer}
                      enableGutter={false}
                      enableProse={false}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Answer — on mobile/tablet, shown below the image+question row */}
            {answer && (
              <div className="mt-4 md:hidden">
                <RichText
                  className="richtext"
                  data={answer}
                  enableGutter={false}
                  enableProse={false}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Template Layout Blocks */}
      {template?.layout && <RenderBlocks blocks={template.layout} />}
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
