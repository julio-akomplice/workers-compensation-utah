import type { Block } from 'payload'

export const Blockquote: Block = {
  slug: 'blockquote',
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
    },
  ],
  interfaceName: 'BlockquoteBlock',
}
