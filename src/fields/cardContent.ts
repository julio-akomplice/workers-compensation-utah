import type { ArrayField, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import deepMerge from '@/utilities/deepMerge'

type CardContentOptions = {
  icon?: boolean
  image?: boolean
  headline?: boolean
  richHeadline?: boolean
  content?: boolean
  richContent?: boolean
  cta?: boolean
  overrides?: Partial<ArrayField>
}

const defaults: Required<Omit<CardContentOptions, 'overrides'>> = {
  icon: false,
  image: true,
  headline: true,
  richHeadline: false,
  content: true,
  richContent: false,
  cta: true,
}

export const cardContent = (options: CardContentOptions = {}): Field => {
  const opts = { ...defaults, ...options }

  const fields: Field[] = []

  if (opts.icon) {
    fields.push({
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: 'Icon',
    })
  }

  if (opts.image) {
    fields.push({
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
    })
  }

  if (opts.headline) {
    fields.push({
      name: 'headline',
      type: 'text',
      label: 'Headline',
    })
  }

  if (opts.richHeadline) {
    fields.push({
      name: 'richHeadline',
      type: 'richText',
      label: 'Rich Headline',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    })
  }

  if (opts.content) {
    fields.push({
      name: 'content',
      type: 'textarea',
      label: 'Content',
    })
  }

  if (opts.richContent) {
    fields.push({
      name: 'richContent',
      type: 'richText',
      label: 'Rich Content',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    })
  }

  if (opts.cta) {
    fields.push(
      link(),
    )
  }

  const result: ArrayField = {
    name: 'cards',
    type: 'array',
    label: 'Cards',
    minRows: 1,
    admin: {
      initCollapsed: true,
    },
    fields,
  }

  return deepMerge(result, options.overrides ?? {})
}
