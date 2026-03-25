import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'

import type { ArticlesSectionBlock as ArticlesSectionBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { ArticlesSlider } from './ArticlesSlider'

type Props = {
  className?: string
} & ArticlesSectionBlockProps

const getArticlesSection = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'articles-section', depth: 2 })
  },
  ['global_articles-section'],
  { tags: ['global_articles-section'] },
)

export const ArticlesSectionBlock: React.FC<Props> = async ({
  overrideAll,
  overrideSectionHeader,
  sectionHeader: overriddenSectionHeader,
  link: overriddenLink,
}) => {
  const payload = await getPayload({ config: configPromise })
  const global = await getArticlesSection()

  const useSectionHeaderOverride = overrideAll || overrideSectionHeader
  const sectionHeader =
    useSectionHeaderOverride && overriddenSectionHeader
      ? overriddenSectionHeader
      : global.sectionHeader
  const link = overrideAll && overriddenLink ? overriddenLink : global.link

  const { docs: posts } = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 10,
    sort: '-publishedAt',
  })

  if (!posts || posts.length === 0) return null

  return (
    <section className="w-full bg-white py-15 md:py-20 lg:py-25">
      <div className="container mx-auto px-5 md:px-8">
        {/* Section Header */}
        {sectionHeader && 'root' in sectionHeader && (
          <div className="section-header text-center mb-15">
            <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
          </div>
        )}

        {/* Slider */}
        <div className="lg:px-[68px]">
          <ArticlesSlider posts={posts} link={link} />
        </div>
      </div>
    </section>
  )
}
