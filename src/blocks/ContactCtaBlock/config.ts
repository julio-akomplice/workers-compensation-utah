import type { Block } from 'payload'

export const ContactCtaBlock: Block = {
  slug: 'contactCta',
  interfaceName: 'ContactCtaBlock',
  labels: {
    singular: 'Contact Button',
    plural: 'Contact Buttons',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      defaultValue: 'Free Case Evaluation',
      admin: {
        description: 'Button text',
      },
    },
  ],
}
