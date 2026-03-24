import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'

import type { ContactSectionBlock as ContactSectionBlockProps } from 'src/payload-types'

import RichText from '@/components/RichText'
import { ContactForm } from './Form'

type Props = {
  className?: string
} & ContactSectionBlockProps

const getContactSection = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'contact-section', depth: 2 })
  },
  ['global_contact-section'],
  { tags: ['global_contact-section'] },
)

export const ContactSectionBlockComponent: React.FC<Props> = async ({
  overrideAll,
  overrideSectionHeader,
  overrideMapUrl,
  sectionHeader: overriddenSectionHeader,
  mapUrl: overriddenMapUrl,
}) => {
  const global = await getContactSection()

  const useSectionHeaderOverride = overrideAll || overrideSectionHeader
  const useMapUrlOverride = overrideAll || overrideMapUrl

  const sectionHeader =
    useSectionHeaderOverride && overriddenSectionHeader
      ? overriddenSectionHeader
      : global.sectionHeader
  const mapUrl = useMapUrlOverride && overriddenMapUrl ? overriddenMapUrl : global.mapUrl
  const form = typeof global.form === 'object' ? global.form : null

  return (
    <section className="w-full py-16 bg-white md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Form */}
          <div className="rounded-[15px] bg-off-white px-8 py-9 md:px-8 md:py-9 overflow-hidden">
            {sectionHeader && (
              <div className="mb-6 text-center [&_h2]:text-h4 [&_h2]:font-semibold [&_h2]:text-dark-blue [&_h3]:text-h4 [&_h3]:font-semibold [&_h3]:text-dark-blue [&_p]:text-body [&_p]:text-deep-blue-900 [&_p]:mt-2 [&_span.highlight]:text-orange">
                <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
              </div>
            )}

            {form && <ContactForm form={form} />}
          </div>

          {/* Right: Map */}
          {mapUrl && (
            <div className="relative min-h-100 overflow-hidden rounded-[15px] lg:min-h-0">
              <iframe
                src={mapUrl}
                className="absolute inset-0 h-full w-full border-0"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
