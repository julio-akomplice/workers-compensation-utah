import type { Block, GroupField } from 'payload'

import { link } from '@/fields/link'
import {
  AlignFeature,
  BoldFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  LinkFeature,
  ParagraphFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const logoLink = link({
  disableLabel: true,
  appearances: false,
  overrides: {
    label: 'Logo Link',
  },
}) as GroupField

export const LandingPageFooter: Block = {
  slug: 'landingPageFooter',
  interfaceName: 'LandingPageFooterBlock',
  labels: {
    singular: 'Footer',
    plural: 'Footers',
  },
  fields: [
    {
      ...logoLink,
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo',
          admin: {
            description: 'Footer logo (SVG recommended).',
          },
        },
        ...logoLink.fields,
      ],
    },
    {
      type: 'collapsible',
      label: 'Contact Columns',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'phone',
          type: 'group',
          label: 'Call',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Heading',
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              label: 'Display Text',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'Phone Link',
              admin: {
                description: 'e.g. tel:8014249675',
              },
            },
          ],
        },
        {
          name: 'office',
          type: 'group',
          label: 'Office',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Heading',
            },
            {
              name: 'value',
              type: 'textarea',
              required: true,
              label: 'Address',
            },
            {
              name: 'mapUrl',
              type: 'text',
              label: 'Map URL',
              admin: {
                description: 'Optional Google Maps link for the address.',
              },
            },
          ],
        },
        {
          name: 'serving',
          type: 'group',
          label: 'Serving',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Heading',
            },
            {
              name: 'value',
              type: 'textarea',
              required: true,
              label: 'Areas',
            },
          ],
        },
      ],
    },
    {
      name: 'disclaimer',
      type: 'richText',
      label: 'Disclaimer',
      editor: lexicalEditor({
        features: [
          ParagraphFeature(),
          BoldFeature(),
          LinkFeature(),
          AlignFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
  ],
}
