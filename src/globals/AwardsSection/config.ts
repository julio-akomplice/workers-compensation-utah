import type { GlobalConfig } from 'payload'

import { revalidateAwardsSection } from './hooks/revalidateAwardsSection'

export const AwardsSectionGlobal: GlobalConfig = {
  slug: 'awards-section',
  label: 'Awards Section',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Global Components',
  },
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
  hooks: {
    afterChange: [revalidateAwardsSection],
  },
}
