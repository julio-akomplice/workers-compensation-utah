import React from 'react'

import type { AreasServedPageBlock as AreasServedPageBlockProps } from 'src/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { ContentWithSidebar } from '@/components/ContentWithSidebar'
import { getShortSideForm } from '@/utilities/getShortSideForm'

type Props = {
  className?: string
} & AreasServedPageBlockProps

export const AreasServedPageBlockComponent: React.FC<Props> = async ({ content, ctaLink }) => {
  const { form, header } = await getShortSideForm()

  return (
    <section className="w-full bg-white">
      <div className="container mx-auto px-5 md:px-8 2xl:px-0">
        <div className="pb-16 pt-8 md:pb-20 md:pt-12 lg:pt-16">
          <ContentWithSidebar form={form} header={header}>
            {/* Content */}
            {content && (
              <div className="">
                <RichText
                  className="richtext"
                  data={content}
                  enableGutter={false}
                  enableProse={false}
                />
              </div>
            )}

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
