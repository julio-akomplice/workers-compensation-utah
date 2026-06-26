import type { Block } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'

export const LandingPageWhyUsSection: Block = {
  slug: 'landingPageWhyUsSection',
  interfaceName: 'LandingPageWhyUsSectionBlock',
  labels: {
    singular: 'LP Why Us Section',
    plural: 'LP Why Us Sections',
  },
  fields: [
    sectionHeader(),
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'mobileBackgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      minRows: 1,
      maxRows: 9,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
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
