import type { Block } from 'payload'

export const Awards: Block = {
  slug: 'awards',
  interfaceName: 'AwardsBlock',
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      defaultValue: 'Our Awards',
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
    },
  ],
}
