import type { Block } from 'payload'

import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ParagraphFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { SupportiveTextFeature } from '@/lexical/supportiveText/feature.server'

export const LandingPageAboutAttorneySection: Block = {
  slug: 'landingPageAboutAttorneySection',
  interfaceName: 'LandingPageAboutAttorneySectionBlock',
  labels: {
    singular: 'LP About Attorney Section',
    plural: 'LP About Attorney Sections',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      admin: {
        description:
          'Use Supportive Text for the gold eyebrow caption, an H2 for the heading, and paragraphs for the body copy.',
      },
      editor: lexicalEditor({
        features: [
          ParagraphFeature(),
          BoldFeature(),
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
  ],
}
