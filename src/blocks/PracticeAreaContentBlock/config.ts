import type { Block } from 'payload'

import {
  BlocksFeature,
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
import { MediaBlock } from '../MediaBlock/config'
import { CtaBanner } from '../CtaBanner/config'
import { VideoBlock } from '../VideoBlock/config'
import { ContactCtaBlock } from '../ContactCtaBlock/config'
import { PhoneButtonBlock } from '../PhoneButtonBlock/config'

export const PracticeAreaContentBlock: Block = {
  slug: 'practiceAreaContent',
  interfaceName: 'PracticeAreaContentBlock',
  labels: {
    singular: 'Practice Area Content',
    plural: 'Practice Area Content Blocks',
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
          BlocksFeature({ blocks: [MediaBlock, CtaBanner, VideoBlock, ContactCtaBlock, PhoneButtonBlock] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
  ],
}
