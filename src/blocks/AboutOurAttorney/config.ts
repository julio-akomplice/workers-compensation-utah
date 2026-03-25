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

export const AboutOurAttorney: Block = {
  slug: 'aboutOurAttorney',
  interfaceName: 'AboutOurAttorneyBlock',
  labels: {
    singular: 'About Our Attorney',
    plural: 'About Our Attorney Blocks',
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
