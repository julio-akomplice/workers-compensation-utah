import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'

import type { FAQSectionBlock as FAQSectionBlockProps } from 'src/payload-types'

import { FAQSectionClient } from './Client'

type Props = {
  className?: string
} & FAQSectionBlockProps

const getFAQSection = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'faq-section', depth: 2 })
  },
  ['global_faq-section'],
  { tags: ['global_faq-section'] },
)

export const FAQSectionBlockComponent: React.FC<Props> = async ({
  overrideAll,
  overrideSectionHeader,
  overrideFaqs,
  sectionHeader: overriddenSectionHeader,
  faqs: overriddenFaqs,
  link: overriddenLink,
}) => {
  const global = await getFAQSection()

  const useSectionHeaderOverride = overrideAll || overrideSectionHeader
  const useFaqsOverride = overrideAll || overrideFaqs

  const sectionHeader =
    useSectionHeaderOverride && overriddenSectionHeader
      ? overriddenSectionHeader
      : global.sectionHeader
  const faqs = useFaqsOverride && overriddenFaqs ? overriddenFaqs : global.faqs
  const link = overrideAll && overriddenLink ? overriddenLink : global.link

  return <FAQSectionClient sectionHeader={sectionHeader} faqs={faqs} link={link} />
}
