import type { Block } from 'payload'

import { link } from '@/fields/link'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  UnorderedListFeature,
  OrderedListFeature,
  BoldFeature,
  ItalicFeature,
  LinkFeature,
} from '@payloadcms/richtext-lexical'

export const AreasServedPageBlock: Block = {
  slug: 'areasServedPage',
  interfaceName: 'AreasServedPageBlock',
  labels: {
    singular: 'Areas Served Page',
    plural: 'Areas Served Page Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Page Content',
      admin: {
        description:
          'Use H2 headings to create sections — they automatically populate the table of contents sidebar.',
      },
      editor: lexicalEditor({
        features: [
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          BoldFeature(),
          ItalicFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
          LinkFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    link({
      overrides: {
        name: 'ctaLink',
        label: 'CTA Button',
        admin: {
          description: 'The phone number CTA button below the content.',
        },
      },
    }),
  ],
}
