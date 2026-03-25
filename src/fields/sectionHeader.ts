import type { Field, RichTextField } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ParagraphFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { SupportiveTextFeature } from '@/lexical/supportiveText/feature.server'
import { HighlightFeature } from '@/lexical/highlight/feature.server'
import deepMerge from '@/utilities/deepMerge'

type SectionHeaderOptions = {
  overrides?: Partial<RichTextField>
}

export const sectionHeader = ({ overrides = {} }: SectionHeaderOptions = {}): Field => {
  const result: RichTextField = {
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

  return deepMerge(result, overrides)
}
