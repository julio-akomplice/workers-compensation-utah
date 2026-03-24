import type { GlobalConfig } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'
import { revalidateContactSection } from './hooks/revalidateContactSection'

export const ContactSection: GlobalConfig = {
  slug: 'contact-section',
  label: 'Contact Section',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Global Components',
  },
  fields: [
    sectionHeader(),
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
  hooks: {
    afterChange: [revalidateContactSection],
  },
}
