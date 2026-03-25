import type { GlobalConfig } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'
import { revalidateShortSideForm } from './hooks/revalidateShortSideForm'

export const ShortSideFormGlobal: GlobalConfig = {
  slug: 'short-side-form',
  label: 'Short Side Form',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Global Components',
  },
  fields: [
    {
      ...sectionHeader(),
      name: 'header',
      label: 'Header',
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: 'Form',
    },
  ],
  hooks: {
    afterChange: [revalidateShortSideForm],
  },
}
