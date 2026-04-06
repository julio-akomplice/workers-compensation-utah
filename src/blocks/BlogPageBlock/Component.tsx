import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type {
  BlogPageBlock as BlogPageBlockProps,
  Post,
  Category,
  Media as MediaType,
} from '@/payload-types'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { ArrowIcon } from '@/components/ui/ArrowIcon'
import { BlogPageClient } from './Client'

type Props = {
  className?: string
} & BlogPageBlockProps

export const BlogPageBlockComponent: React.FC<Props> = async ({
  sectionHeader,
  postsPerPage,
}) => {
  const payload = await getPayload({ config: configPromise })
  const limit = postsPerPage || 9

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit,
    sort: '-publishedAt',
    where: {
      _status: { equals: 'published' },
    },
  })

  if (!posts || posts.docs.length === 0) return null

  return (
    <section className="w-full bg-white py-[40px] md:py-[60px]">
      <div className="container mx-auto px-5 md:px-8 2xl:px-0">
        {/* Section Header */}
        {sectionHeader && 'root' in sectionHeader && (
          <div className="section-header mb-10 text-center md:mb-[60px]">
            <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
          </div>
        )}

        {/* Blog Cards Grid */}
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-x-[20px] gap-y-[40px] sm:grid-cols-2 md:gap-x-[30px] md:gap-y-[60px] lg:grid-cols-3">
          {posts.docs.map((post) => {
            const metaImage =
              post.meta?.image && typeof post.meta.image === 'object'
                ? (post.meta.image as MediaType)
                : null
            const heroImage =
              typeof post.heroImage === 'object' ? (post.heroImage as MediaType) : null
            const image = metaImage || heroImage

            const categories =
              post.categories && Array.isArray(post.categories)
                ? post.categories
                    .map((cat) => (typeof cat === 'object' ? (cat as Category) : null))
                    .filter(Boolean)
                : []

            const description = post.meta?.description || ''

            return (
              <a
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group flex flex-col"
              >
                {/* Image */}
                <div className="aspect-[16/9] overflow-hidden rounded-[10px] bg-navy-50">
                  {image ? (
                    <Media
                      resource={image}
                      imgClassName="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-dark-blue">
                      <span className="text-white opacity-50">No image</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="mt-[16px] flex flex-col gap-[16px]">
                  {/* Category Pills */}
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {categories.slice(0, 2).map((cat) =>
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
                  <h3 className="text-[20px] font-semibold leading-[24px] tracking-[-0.6px] text-dark-blue">
                    {post.title}
                  </h3>

                  {/* Description */}
                  {description && (
                    <p className="line-clamp-3 text-[16px] leading-[24px] tracking-[-0.32px] text-deep-blue-800">
                      {description}
                    </p>
                  )}

                  {/* Read More */}
                  <div className="flex items-center gap-1 text-[16px] font-medium tracking-[-0.32px] text-navy-500">
                    <span>Read More</span>
                    <ArrowIcon className="h-6 w-6 text-gold" />
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* Pagination */}
        {posts.totalPages > 1 && posts.page && (
          <BlogPageClient
            page={posts.page}
            totalPages={posts.totalPages}
            limit={limit}
          />
        )}
      </div>
    </section>
  )
}
