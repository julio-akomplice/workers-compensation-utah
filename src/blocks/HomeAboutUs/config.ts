import type { Block } from 'payload'

import { link } from '@/fields/link'
import { sectionHeader } from '@/fields/sectionHeader'

export const HomeAboutUs: Block = {
  slug: 'homeAboutUs',
  interfaceName: 'HomeAboutUsBlock',
  labels: {
    singular: 'Home About Us',
    plural: 'Home About Us Blocks',
  },
  fields: [
    sectionHeader(),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    link({
      overrides: {
        label: 'CTA Link',
      },
    }),
  ],
}
