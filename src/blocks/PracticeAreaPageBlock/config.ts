import type { Block } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'
import { link } from '@/fields/link'

export const PracticeAreaPageBlock: Block = {
  slug: 'practiceAreaPage',
  interfaceName: 'PracticeAreaPageBlock',
  labels: {
    singular: 'Practice Area Page',
    plural: 'Practice Area Page Blocks',
  },
  fields: [
    sectionHeader(),
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'practice-area-categories',
      hasMany: true,
      required: true,
      label: 'Practice Area Categories',
      admin: {
        description: 'Select the categories to display. Each category becomes a section with its practice areas.',
      },
    },
    link({
      overrides: {
        name: 'ctaLink',
        label: 'CTA Button',
        admin: {
          description: 'The "Free Case Evaluation" button below the practice areas.',
        },
      },
    }),
  ],
}
