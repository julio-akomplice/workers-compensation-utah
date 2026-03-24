import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ParagraphFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { SupportiveTextFeature } from '@/lexical/supportiveText/feature.server'
import { HighlightFeature } from '@/lexical/highlight/feature.server'

export const sectionHeader = (): Field => {
  return {
    name: 'sectionHeader',
    type: 'richText',
    label: 'Section Header',
    editor: lexicalEditor({
      features: [
        ParagraphFeature(),
        SupportiveTextFeature(),
        HighlightFeature(),
        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ],
    }),
  }
}
