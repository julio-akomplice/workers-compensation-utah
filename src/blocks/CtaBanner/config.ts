import type { Block } from 'payload'

export const CtaBanner: Block = {
  slug: 'ctaBanner',
  interfaceName: 'CtaBannerBlock',
  labels: {
    singular: 'CTA Banner',
    plural: 'CTA Banners',
  },
  fields: [
    {
      name: 'ctaBanner',
      label: 'CTA Banner',
      type: 'relationship',
      relationTo: 'cta-banners',
      required: true,
      admin: {
        description: 'Select a CTA Banner template',
      },
    },
    {
      name: 'variables',
      type: 'array',
      admin: {
        description:
          'Override variable values from the template. Leave empty to use all defaults.',
        components: {
          Field: '@/blocks/CtaBanner/VariablesArray',
        },
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            components: {
              Field: '@/blocks/CtaBanner/VariableNameSelect',
            },
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'The text that replaces the variable',
          },
        },
        {
          name: 'isLink',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Wrap this variable in a link?',
          },
        },
        {
          name: 'href',
          type: 'text',
          admin: {
            description: 'The URL for the link (e.g. tel:8014249675 or https://...)',
            condition: (_data, siblingData) => siblingData?.isLink,
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Open link in a new tab?',
            condition: (_data, siblingData) => siblingData?.isLink,
          },
        },
      ],
    },
  ],
}
