import type { Block } from 'payload'

import { link } from '@/fields/link'

export const ResourcesPageBlock: Block = {
  slug: 'resourcesPage',
  interfaceName: 'ResourcesPageBlock',
  labels: {
    singular: 'Resources Page',
    plural: 'Resources Page Blocks',
  },
  fields: [
    {
      name: 'sectionDescription',
      type: 'textarea',
      required: true,
      label: 'Section Description',
    },
    {
      name: 'resourceCards',
      type: 'array',
      label: 'Resource Cards',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Logo / Image',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
        },
        {
          name: 'websites',
          type: 'array',
          label: 'Website Links',
          minRows: 1,
          fields: [
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'URL',
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Display Label',
            },
          ],
        },
      ],
    },
    link({
      overrides: {
        name: 'ctaLink',
        label: 'CTA Button',
      },
    }),
  ],
}
