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
import { generateMeta } from '@/utilities/generateMeta'
import { SchemaMarkup } from '@/components/SchemaMarkup'
import PageClient from './page.client'
import { ContentWithSidebar } from '@/components/ContentWithSidebar'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { FactCheckedBy } from './FactCheckedBy'
import { BlogPostCTA } from './BlogPostCTA'
import { PostNavigation } from './PostNavigation'
import { TEMPLATE_TYPES, type TemplateType } from '@/collections/Templates/templateTypes'

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
  const url = '/blogs/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const [{ form, header }, template, { previousPost, nextPost }] = await Promise.all([
    getShortSideForm(),
    queryTemplate({ templateType: TEMPLATE_TYPES.BLOG_POST }),
    getAdjacentPosts({ publishedAt: post.publishedAt, id: post.id }),
  ])

  const { categories, title, heroImage, publishedAt } = post

  const categoryList =
    categories && Array.isArray(categories)
      ? categories
          .map((cat) => (typeof cat === 'object' ? (cat as Category) : null))
          .filter(Boolean)
      : []

  return (
    <article className="desktop:pt-header">
      <SchemaMarkup schema={post.meta?.schema} />
      <PageClient docId={post.id} collectionSlug="posts" />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {/* Hero Banner - hidden */}
      {/* <PostHero post={post} /> */}

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[{ label: 'Legal Insights & Case Updates', href: '/blogs' }, { label: title }]}
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

                {/* Author & Date - hidden */}
              </div>

              {/* Featured Image */}
              {heroImage && typeof heroImage !== 'string' && (
                <div className="aspect-[16/9] overflow-hidden rounded-[10px]">
                  <Media resource={heroImage} imgClassName="h-full w-full object-cover" />
                </div>
              )}

              {/* Date + Divider */}
              <div className="mt-5 mb-8 flex flex-col gap-[25px] md:mb-10">
                {publishedAt && (
                  <p className="text-[16px] font-normal leading-normal tracking-[-0.32px] text-deep-blue-900">
                    Updated:{' '}
                    {new Date(publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
                <hr className="border-navy-30" />
              </div>

              {/* Rich Text Content */}
              <RichText
                className="richtext"
                data={post.content}
                enableGutter={false}
                enableProse={false}
              />

              <FactCheckedBy data={template?.blogPost} />
              <BlogPostCTA data={template?.blogPost} />
              <PostNavigation previousPost={previousPost} nextPost={nextPost} />
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

const queryTemplate = cache(async ({ templateType }: { templateType: TemplateType }) => {
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

const getAdjacentPosts = cache(
  async ({ publishedAt, id }: { publishedAt?: string | null; id: string }) => {
    const payload = await getPayload({ config: configPromise })

    const [prevResult, nextResult] = await Promise.all([
      payload.find({
        collection: 'posts',
        draft: false,
        limit: 1,
        pagination: false,
        sort: '-publishedAt',
        select: { title: true, slug: true },
        where: {
          id: { not_equals: id },
          ...(publishedAt ? { publishedAt: { less_than: publishedAt } } : {}),
        },
      }),
      payload.find({
        collection: 'posts',
        draft: false,
        limit: 1,
        pagination: false,
        sort: 'publishedAt',
        select: { title: true, slug: true },
        where: {
          id: { not_equals: id },
          ...(publishedAt ? { publishedAt: { greater_than: publishedAt } } : {}),
        },
      }),
    ])

    return {
      previousPost: prevResult.docs?.[0] || null,
      nextPost: nextResult.docs?.[0] || null,
    }
  },
)
