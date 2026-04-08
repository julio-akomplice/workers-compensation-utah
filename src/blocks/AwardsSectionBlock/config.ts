import type { Block } from 'payload'

export const AwardsSectionBlock: Block = {
  slug: 'awardsSection',
  interfaceName: 'AwardsSectionBlock',
  labels: {
    singular: 'Awards Section',
    plural: 'Awards Section Blocks',
  },
  fields: [
    {
      name: 'overrideHeadline',
      type: 'checkbox',
      label: 'Override Headline',
      defaultValue: false,
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Headline',
      admin: {
        condition: (_, siblingData) => siblingData?.overrideHeadline,
      },
    },
    {
      name: 'overrideGallery',
      type: 'checkbox',
      label: 'Override Gallery',
      defaultValue: false,
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.overrideGallery,
      },
    },
  ],
}
