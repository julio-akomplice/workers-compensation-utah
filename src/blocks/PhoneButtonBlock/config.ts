import type { Block } from 'payload'

export const PhoneButtonBlock: Block = {
  slug: 'phoneButton',
  interfaceName: 'PhoneButtonBlock',
  labels: {
    singular: 'Phone Button',
    plural: 'Phone Buttons',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      defaultValue: '(801) 424-WORK (9675)',
      admin: {
        description: 'Button text (e.g. "Call (801) 424-9675")',
      },
    },
  ],
}
