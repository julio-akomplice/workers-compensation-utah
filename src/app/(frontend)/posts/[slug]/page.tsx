import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { getShortSideForm } from '@/utilities/getShortSideForm'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import { Breadcrumbs } from '@/components/Breadcrumbs'

import type { Post, Category } from '@/payload-types'

import { Media } from '@/components/Media'
import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import { formatAuthors } from '@/utilities/formatAuthors'
import { formatDateTime } from '@/utilities/formatDateTime'
import PageClient from './page.client'
import { ContentWithSidebar } from '@/components/ContentWithSidebar'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const { form, header } = await getShortSideForm()

  const { categories, populatedAuthors, publishedAt, title, heroImage } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  const categoryList =
    categories && Array.isArray(categories)
      ? categories
          .map((cat) => (typeof cat === 'object' ? (cat as Category) : null))
          .filter(Boolean)
      : []

  return (
    <article>
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {/* Hero Banner */}
      <PostHero post={post} />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Legal Insights & Case Updates', href: '/posts' },
          { label: title },
        ]}
      />

      {/* Content Section */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-5 md:px-8 2xl:px-0">
          <div className="pb-16 pt-8 md:pb-20 md:pt-12 lg:pt-16">
            <ContentWithSidebar form={form} header={header}>
              {/* Post Header Info */}
              <div className="mb-8 md:mb-10">
                {/* Categories */}
                {categoryList.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {categoryList.map((cat) =>
                      cat ? (
                        <span
                          key={cat.id}
                          className="rounded-full border border-navy-100 px-[10px] py-[2px] text-[14px] font-medium leading-[22px] tracking-[-0.28px] text-navy-300"
                        >
                          {cat.title}
                        </span>
                      ) : null,
                    )}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-[28px] font-semibold leading-[32px] tracking-[-0.84px] text-dark-blue md:text-[36px] md:leading-[40px] md:tracking-[-1.08px] lg:text-[42px] lg:leading-[46px] lg:tracking-[-1.26px]">
                  {title}
                </h1>

                {/* Author & Date */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-[14px] tracking-[-0.28px] text-navy-300">
                  {hasAuthors && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-navy-500">By</span>
                      <span className="font-semibold text-navy-800">
                        {formatAuthors(populatedAuthors)}
                      </span>
                    </div>
                  )}
                  {hasAuthors && publishedAt && (
                    <span className="text-navy-100">|</span>
                  )}
                  {publishedAt && (
                    <time dateTime={publishedAt} className="text-navy-300">
                      {formatDateTime(publishedAt)}
                    </time>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              {heroImage && typeof heroImage !== 'string' && (
                <div className="mb-8 aspect-[16/9] overflow-hidden rounded-[10px] md:mb-10">
                  <Media
                    resource={heroImage}
                    imgClassName="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Rich Text Content */}
              <RichText
                className="richtext"
                data={post.content}
                enableGutter={false}
                enableProse={false}
              />
            </ContentWithSidebar>
          </div>
        </div>
      </section>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
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
