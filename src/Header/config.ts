import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Logo',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'phone',
      type: 'group',
      label: 'Phone CTA',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Display Text',
          defaultValue: '(801) 424-WORK (9675)',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'Phone Link',
          defaultValue: 'tel:+18014249675',
          admin: {
            description: 'e.g. tel:+18014249675',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
