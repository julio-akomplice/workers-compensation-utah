import React from 'react'

import type { Metadata } from 'next'
import type { AreasServed, Form as FormType, Page, PracticeArea, ShortSideForm as ShortSideFormType } from '@/payload-types'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import RichText from '@/components/RichText'
import { ContentWithSidebar } from '@/components/ContentWithSidebar'
import { RelatedPages } from '@/components/RelatedPages'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import { getShortSideForm } from '@/utilities/getShortSideForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { SchemaMarkup } from '@/components/SchemaMarkup'
import PageClient from '../page.client'
import { queryAreaServedBySlug } from './queries'

type Props = {
  areaServed: AreasServed
  url: string
  draft: boolean
  form: FormType | null
  header: ShortSideFormType['header'] | undefined
}

export const AreaServedTemplate: React.FC<Props> = ({ areaServed, url, draft, form, header }) => {
  const { hero, layout, contentSection, relatedPages, meta } = areaServed

  const relatedPageLinks = (relatedPages || [])
    .map((p) => {
      if (typeof p !== 'object' || !p) return null
      const doc = p.value
      if (typeof doc !== 'object' || !doc) return null
      if (p.relationTo === 'areas-served') {
        const areaDoc = doc as AreasServed
        const breadcrumbs = areaDoc.breadcrumbs
        const breadcrumbUrl =
          Array.isArray(breadcrumbs) && breadcrumbs.length > 0
            ? breadcrumbs[breadcrumbs.length - 1]?.url
            : null
        return { title: areaDoc.title, href: breadcrumbUrl ?? `/${areaDoc.slug}` }
      }
      const practiceDoc = doc as PracticeArea
      return { title: practiceDoc.title, href: `/${practiceDoc.slug}` }
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)

  return (
    <article>
      <SchemaMarkup schema={meta?.schema} />
      <PageClient docId={areaServed.id} collectionSlug="areas-served" />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <RenderHero {...hero} />
      <Breadcrumbs
        items={[
          { label: 'Areas Served', href: '/areas-served' },
          { label: areaServed.title },
        ]}
      />
      {contentSection?.content && (
        <section className="w-full bg-white">
          <div className="container mx-auto px-5 md:px-8 2xl:px-0">
            <div className="pb-16 pt-8 md:pb-20 md:pt-12 lg:pt-16">
              <ContentWithSidebar
                form={form}
                header={header}
                sidebarExtra={<RelatedPages pages={relatedPageLinks} />}
              >
                <div>
                  <RichText
                    className="richtext"
                    data={contentSection.content}
                    enableGutter={false}
                    enableProse={false}
                  />
                </div>
              </ContentWithSidebar>
            </div>
          </div>
        </section>
      )}
      <RenderBlocks blocks={layout as Page['layout'][0][]} />
    </article>
  )
}

export async function resolveAreaServedComponent(
  slugPath: string[],
  url: string,
  draft: boolean,
): Promise<React.ReactNode | null> {
  const areaServed = await queryAreaServedBySlug({ slugPath })
  if (!areaServed) return null

  const { form, header } = await getShortSideForm()
  return (
    <AreaServedTemplate
      areaServed={areaServed}
      url={url}
      draft={draft}
      form={form}
      header={header}
    />
  )
}

export async function resolveAreaServedMetadata(slugPath: string[]): Promise<Metadata | null> {
  const areaServed = await queryAreaServedBySlug({ slugPath })
  if (!areaServed) return null
  return generateMeta({ doc: areaServed as never })
}
