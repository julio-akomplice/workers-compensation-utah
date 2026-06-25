import type { Block } from 'payload'

import {
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
    singular: 'Landing Page About Attorney Section',
    plural: 'Landing Page About Attorney Sections',
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
