import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { AreasServedPageBlock as AreasServedPageBlockProps } from 'src/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { AreasServedPageClient } from './Client'

type Props = {
  className?: string
} & AreasServedPageBlockProps

export const AreasServedPageBlockComponent: React.FC<Props> = async ({ content, ctaLink }) => {
  const payload = await getPayload({ config: configPromise })

  // Fetch the global Short Side Form
  const shortSideFormGlobal = await payload.findGlobal({
    slug: 'short-side-form',
  })

  const form =
    shortSideFormGlobal?.form && typeof shortSideFormGlobal.form === 'object'
      ? shortSideFormGlobal.form
      : null
  const header = shortSideFormGlobal?.header || undefined

  return (
    <section className="w-full bg-white">
      <div className="container mx-auto px-5 md:px-8 2xl:px-0">
        <div className="pb-16 pt-8 md:pb-20 md:pt-12 lg:pt-16">
          <AreasServedPageClient form={form} header={header}>
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
          </AreasServedPageClient>
        </div>
      </div>
    </section>
  )
}
