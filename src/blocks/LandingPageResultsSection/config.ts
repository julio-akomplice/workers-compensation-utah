import type { Block } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'

export const LandingPageResultsSection: Block = {
  slug: 'landingPageResultsSection',
  interfaceName: 'LandingPageResultsSectionBlock',
  labels: {
    singular: 'Landing Page Results Section',
    plural: 'Landing Page Results Sections',
  },
  fields: [
    sectionHeader(),
    {
      name: 'results',
      type: 'array',
      label: 'Results',
      minRows: 1,
      maxRows: 8,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'stat',
          type: 'text',
          required: true,
          admin: {
            description: 'The headline figure, e.g. "$2M+" or "30 yrs".',
          },
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
