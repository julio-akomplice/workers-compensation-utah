import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { sectionHeader } from '@/fields/sectionHeader'
import { revalidateFAQSection } from './hooks/revalidateFAQSection'

export const FAQSectionGlobal: GlobalConfig = {
  slug: 'faq-section',
  label: 'FAQ Section',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Global Components',
  },
  fields: [
    sectionHeader(),
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faq',
      hasMany: true,
      maxRows: 8,
      label: 'FAQs',
      admin: {
        description: 'Select FAQs to display in this section.',
      },
    },
    link({
      overrides: {
        label: 'CTA Link',
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateFAQSection],
  },
}
