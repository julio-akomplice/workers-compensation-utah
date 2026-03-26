import type { Block } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'

export const FAQPageBlock: Block = {
  slug: 'faqPage',
  interfaceName: 'FAQPageBlock',
  labels: {
    singular: 'FAQ Page',
    plural: 'FAQ Page Blocks',
  },
  fields: [
    sectionHeader(),
  ],
}
