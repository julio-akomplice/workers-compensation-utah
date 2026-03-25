import React from 'react'

import type { ContactPageBlock as ContactPageBlockProps } from 'src/payload-types'

import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { PhoneIcon } from '@/assets/icons/PhoneIcon'
import { ContactForm } from '../ContactSectionBlock/Form'

type Props = {
  className?: string
} & ContactPageBlockProps

export const ContactPageBlockComponent: React.FC<Props> = ({
  sectionHeader,
  phoneLink,
  form: formData,
  mapUrl,
}) => {
  const form = typeof formData === 'object' ? formData : null

  return (
    <section className="w-full bg-white pt-[60px] pb-[60px] md:pt-[80px] md:pb-[80px] lg:pt-20 lg:pb-0">
      <div className="container mx-auto px-5 md:px-0">
        {/* Header: Heading + Subtitle + Phone CTA */}
        <div className="mx-auto mb-8 text-center md:mb-10">
          {sectionHeader && (
            <div className="section-header">
              <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
            </div>
          )}

          {phoneLink?.url && (
            <div className="mt-5 md:mt-6">
              <Button asChild>
                <a href={phoneLink.url}>
                  <PhoneIcon className="w-5 h-5 shrink-0 text-white" />
                  {phoneLink.label && <span>{phoneLink.label}</span>}
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Form Card */}
        {form && (
          <div className="mx-auto max-w-[636px] md:rounded-[15px] md:bg-off-white md:px-8 md:py-9 overflow-hidden">
            <ContactForm form={form} />
          </div>
        )}
      </div>

      {/* Map - Full Width */}
      {mapUrl && (
        <div className="mt-10 px-5 md:mt-12 md:px-8 lg:mt-14 lg:px-0">
          <div className="relative h-[300px] overflow-hidden rounded-[10px] md:h-[400px] md:rounded-[15px] lg:h-[500px] lg:rounded-none">
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
        </div>
      )}
    </section>
  )
}
