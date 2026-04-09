import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type {
  PracticeAreaPageBlock as PracticeAreaPageBlockProps,
  PracticeArea,
  PracticeAreaCategory,
} from 'src/payload-types'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { ArrowIcon } from '@/components/ui/ArrowIcon'
import { ContentWithSidebar } from '@/components/ContentWithSidebar'
import { getShortSideForm } from '@/utilities/getShortSideForm'

type Props = {
  className?: string
} & PracticeAreaPageBlockProps

type CategorySection = {
  id: string
  title: string
  slug: string
  practiceAreas: PracticeArea[]
}

export const PracticeAreaPageBlockComponent: React.FC<Props> = async ({
  sectionHeader,
  categories,
  ctaLink,
}) => {
  const payload = await getPayload({ config: configPromise })
  const { form, header } = await getShortSideForm()

  // Resolve categories
  const resolvedCategories: PracticeAreaCategory[] = (categories || [])
    .map((cat) => (typeof cat === 'object' ? cat : null))
    .filter((cat): cat is PracticeAreaCategory => cat !== null)

  // Fetch practice areas grouped by category
  const categorySections: CategorySection[] = []

  for (const category of resolvedCategories) {
    const result = await payload.find({
      collection: 'practice-areas',
      where: {
        categories: { equals: category.id },
      },
      sort: 'title',
      limit: 100,
      select: {
        title: true,
        slug: true,
        general: true,
      },
    })

    if (result.docs.length > 0) {
      categorySections.push({
        id: String(category.id),
        title: category.title,
        slug: typeof category.slug === 'string' ? category.slug : String(category.id),
        practiceAreas: result.docs as PracticeArea[],
      })
    }
  }

  return (
    <section className="w-full bg-white">
      <div className="container mx-auto px-5 md:px-8 2xl:px-0">
        <div className="pb-16 pt-8 md:pb-20 md:pt-12 lg:pt-16">
          {/* Main Layout: TOC | Content | Form */}
          <ContentWithSidebar
            tocItems={categorySections.map((section) => ({
              id: `category-${section.slug}`,
              label: section.title,
            }))}
            form={form}
            header={header}

          >
            {/* Section Header */}
            {sectionHeader && 'root' in sectionHeader && (
              <div className="mb-10 section-header md:mb-14">
                <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
              </div>
            )}

            {/* Practice Area Categories */}
            <div className="flex flex-col">
              {categorySections.map((section, sectionIndex) => (
                <div key={section.id}>
                  <div
                    id={`category-${section.slug}`}
                    className="scroll-mt-[120px]"
                  >
                    <h3 className="text-h4 font-semibold tracking-[-0.96px] text-dark-blue md:text-[28px] md:leading-[32px]">
                      {section.title}
                    </h3>

                    <div className="mt-5 flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
                      {section.practiceAreas.map((area) => (
                        <Link
                          key={area.id}
                          href={`/practice-areas/${area.slug}`}
                          className="flex items-center gap-3 rounded-[10px] bg-off-white px-4 py-4 transition-colors hover:bg-navy-30 md:px-5 md:py-5"
                        >
                          {area.general?.icon && (
                            <div className="h-6 w-6 shrink-0 [&_img]:h-full [&_img]:w-full [&_img]:object-contain [&_svg]:h-full [&_svg]:w-full">
                              <Media resource={area.general.icon} />
                            </div>
                          )}
                          <span className="flex-1 text-body font-semibold tracking-[-0.32px] text-navy-800">
                            {area.general?.alternativeTitle || area.title}
                          </span>
                          <ArrowIcon className="h-6 w-6 shrink-0 text-navy-50" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {sectionIndex < categorySections.length - 1 && (
                    <hr className="mt-[50px] mb-[35px] border-navy-50 md:my-10" />
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            {ctaLink && (
              <div className="mt-10 md:mt-12">
                <CMSLink {...ctaLink} />
              </div>
            )}
          </ContentWithSidebar>
        </div>
      </div>
    </section>
  )
}
