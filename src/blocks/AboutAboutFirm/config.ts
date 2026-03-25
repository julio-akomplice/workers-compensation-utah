import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ParagraphFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { SupportiveTextFeature } from '@/lexical/supportiveText/feature.server'
import { link } from '@/fields/link'

export const AboutAboutFirm: Block = {
  slug: 'aboutAboutFirm',
  interfaceName: 'AboutAboutFirmBlock',
  labels: {
    singular: 'About About Firm',
    plural: 'About About Firm Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      editor: lexicalEditor({
        features: [
          ParagraphFeature(),
          SupportiveTextFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      required: true,
    },
    {
      name: 'achievements',
      type: 'array',
      label: 'Achievements',
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Value',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    link({
      overrides: {
        label: 'CTA Link',
      },
    }),
  ],
}
