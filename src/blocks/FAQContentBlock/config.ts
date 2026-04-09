import type { Block } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'
import { link } from '@/fields/link'
import {
  BoldFeature,
  LinkFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FAQContentBlock: Block = {
  slug: 'faqContent',
  interfaceName: 'FAQContentBlock',
  labels: {
    singular: 'Manual FAQ Block',
    plural: 'Manual FAQ Blocks',
  },
  fields: [
    sectionHeader({
      overrides: {
        defaultValue: {
          root: {
            type: 'root',
            children: [
              {
                type: 'supportiveText',
                children: [{ type: 'text', text: 'Workers Compensation Utah' }],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [{ type: 'text', text: 'Frequently Asked Questions' }],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    }),
    {
      name: 'faqs',
      type: 'array',
      label: 'FAQs',
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          label: 'Question',
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
          label: 'Answer',
          editor: lexicalEditor({
            features: [
              BoldFeature(),
              LinkFeature(),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
      ],
    },
    link({
      overrides: {
        label: 'CTA Link',
      },
    }),
  ],
}
