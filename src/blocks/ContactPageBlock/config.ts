import type { Block } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'
import { link } from '@/fields/link'

export const ContactPageBlock: Block = {
  slug: 'contactPage',
  interfaceName: 'ContactPageBlock',
  labels: {
    singular: 'Contact Page',
    plural: 'Contact Page Blocks',
  },
  fields: [
    sectionHeader(),
    link({
      overrides: {
        name: 'phoneLink',
        label: 'Phone CTA Link',
      },
    }),
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: 'Form',
    },
    {
      name: 'mapUrl',
      type: 'text',
      required: true,
      label: 'Map Embed URL',
    },
  ],
}
