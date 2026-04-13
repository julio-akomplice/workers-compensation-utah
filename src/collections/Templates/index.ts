import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { hero } from '@/heros/config'
import { blogPostFields } from './blogPostFields'
import { templateTypeOptions } from './templateTypes'

export const Templates: CollectionConfig = {
  slug: 'templates',
  labels: {
    singular: 'Template',
    plural: 'Templates',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'templateType', 'updatedAt'],
    useAsTitle: 'title',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal label for this template (e.g. "FAQ Template")',
      },
    },
    {
      name: 'templateType',
      type: 'select',
      required: true,
      unique: true,
      options: [...templateTypeOptions],
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          label: 'Content',
          fields: [blogPostFields],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'solidMenu',
              type: 'checkbox',
              label: 'Solid Menu',
              defaultValue: false,
              admin: {
                description:
                  'Enable this when the template has no hero image. The navigation bar will have a solid dark background instead of being transparent.',
              },
            },
          ],
        },
      ],
    },
  ],
}
