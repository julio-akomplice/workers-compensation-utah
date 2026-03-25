import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { sectionHeader } from '@/fields/sectionHeader'

export const LawyerBioBlock: Block = {
  slug: 'lawyerBioBlock',
  interfaceName: 'LawyerBioBlockBlock',
  labels: {
    singular: 'Lawyer Bio Block',
    plural: 'Lawyer Bio Blocks',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Profile Info',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          required: true,
        },
        {
          name: 'profilePicture',
          type: 'upload',
          relationTo: 'media',
          label: 'Profile Picture',
          required: true,
        },
        {
          name: 'phone',
          type: 'group',
          label: 'Phone',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Display Label',
              required: true,
              admin: {
                description: 'e.g. (801) 424-9675',
              },
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link URL',
              required: true,
              admin: {
                description: 'e.g. tel:8014249675',
              },
            },
            {
              name: 'icon',
              type: 'upload',
              relationTo: 'media',
              label: 'Icon',
              required: true,
            },
          ],
        },
        {
          name: 'fax',
          type: 'group',
          label: 'Fax',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Display Label',
              required: true,
              admin: {
                description: 'e.g. (801) 683-7575',
              },
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link URL',
              required: true,
              admin: {
                description: 'e.g. tel:8016837575',
              },
            },
            {
              name: 'icon',
              type: 'upload',
              relationTo: 'media',
              label: 'Icon',
              required: true,
            },
          ],
        },
      ],
    },
    sectionHeader(),
    {
      name: 'achievements',
      type: 'array',
      label: 'Achievement Logos',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Achievement Image',
          required: true,
        },
      ],
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Bio Content',
      editor: lexicalEditor({
        features: [
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          UnorderedListFeature(),
          OrderedListFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      required: true,
    },
  ],
}
