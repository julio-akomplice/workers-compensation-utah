import type { Block } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'

export const LandingPageSettlementsSection: Block = {
  slug: 'landingPageSettlementsSection',
  interfaceName: 'LandingPageSettlementsSectionBlock',
  labels: {
    singular: 'Landing Page Settlements Section',
    plural: 'Landing Page Settlements Sections',
  },
  fields: [
    sectionHeader(),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'settlements',
      type: 'array',
      label: 'Settlements',
      minRows: 1,
      labels: {
        singular: 'Settlement',
        plural: 'Settlements',
      },
      admin: {
        description: 'Each row shows a settlement amount and a short case description.',
      },
      fields: [
        {
          name: 'amount',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g. "$2,000,000" or "$400,000+"',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Bold lead-in, e.g. "Workers\' comp" or "Personal injury settlement".',
          },
        },
        {
          name: 'description',
          type: 'text',
          admin: {
            description:
              'Optional muted detail shown after the label, e.g. "wage loss & medical care after a chemical explosion". Leave empty to show only the label.',
          },
        },
      ],
    },
    {
      name: 'disclaimer',
      type: 'textarea',
    },
  ],
}
