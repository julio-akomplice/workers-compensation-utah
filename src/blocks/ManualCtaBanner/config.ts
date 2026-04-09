import type { Block } from 'payload'

import {
  BlocksFeature,
  BoldFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  LinkFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { PhoneInlineBlock } from '../PhoneInlineBlock/config'
import { PhoneWorkInlineBlock } from '../PhoneWorkInlineBlock/config'

export const ManualCtaBanner: Block = {
  slug: 'manualCtaBanner',
  interfaceName: 'ManualCtaBannerBlock',
  labels: {
    singular: 'Manual CTA Banner',
    plural: 'Manual CTA Banners',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Content',
      editor: lexicalEditor({
        features: [
          BoldFeature(),
          LinkFeature(),
          BlocksFeature({ inlineBlocks: [PhoneInlineBlock, PhoneWorkInlineBlock] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
  ],
}
