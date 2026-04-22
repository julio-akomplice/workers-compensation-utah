import type { Block } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'

export const AboutWhyChooseUs: Block = {
  slug: 'aboutWhyChooseUs',
  interfaceName: 'AboutWhyChooseUsBlock',
  labels: {
    singular: 'About Why Choose Us',
    plural: 'About Why Choose Us Blocks',
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
      maxRows: 8,
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
