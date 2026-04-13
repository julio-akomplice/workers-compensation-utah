import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import { BoldFeature, ParagraphFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  trash: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'title', 'rating', 'updatedAt'],
    useAsTitle: 'displayTitle',
  },
  disableDuplicate: false,
  fields: [
    {
      name: 'displayTitle',
      type: 'text',
      admin: {
        hidden: true,
      },

      hooks: {
        beforeChange: [
          ({ data }) => {
            return `${data?.name || ''} - ${data?.title || ''}`
          },
        ],
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      defaultValue: 5,
      required: true,
      min: 0,
      max: 5,
      admin: {
        step: 0.5,
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (typeof value !== 'number') return 5
            const floored = Math.floor(value * 2) / 2
            return Math.min(5, Math.max(0, floored))
          },
        ],
      },
    },
    {
      name: 'testimonial',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: [ParagraphFeature(), BoldFeature()],
      }),
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
