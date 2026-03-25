import type { Block } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'
import { link } from '@/fields/link'

export const AboutGetStarted: Block = {
  slug: 'aboutGetStarted',
  interfaceName: 'AboutGetStartedBlock',
  labels: {
    singular: 'About Get Started',
    plural: 'About Get Started Blocks',
  },
  fields: [
    sectionHeader(),
    {
      name: 'steps',
      type: 'array',
      label: 'Steps',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'stepLabel',
          type: 'text',
          label: 'Step Label',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
    link({
      overrides: {
        label: 'CTA Link',
      },
    }),
  ],
}
