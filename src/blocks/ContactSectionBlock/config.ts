import type { Block, Field } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'

export const ContactSectionBlock: Block = {
  slug: 'contactSection',
  interfaceName: 'ContactSectionBlock',
  labels: {
    singular: 'Contact Section',
    plural: 'Contact Section Blocks',
  },
  fields: [
    {
      name: 'theme',
      type: 'select',
      label: 'Theme',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Off White', value: 'offWhite' },
      ],
    },
    {
      name: 'overrideAll',
      type: 'checkbox',
      label: 'Override All Content',
      defaultValue: false,
      admin: {
        description: 'Enable to override all fields from the global Contact Section.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'overrideSectionHeader',
          type: 'checkbox',
          label: 'Override Section Header',
          defaultValue: false,
          admin: {
            condition: (_, siblingData) => !siblingData?.overrideAll,
            width: '50%',
          },
        },
        {
          name: 'overrideMapUrl',
          type: 'checkbox',
          label: 'Override Map URL',
          defaultValue: false,
          admin: {
            condition: (_, siblingData) => !siblingData?.overrideAll,
            width: '50%',
          },
        },
      ],
    },
    {
      ...sectionHeader(),
      admin: {
        ...sectionHeader().admin,
        condition: (_, siblingData) =>
          siblingData?.overrideAll || siblingData?.overrideSectionHeader,
      },
    } as Field,
    {
      name: 'mapUrl',
      type: 'text',
      label: 'Map Embed URL',
      admin: {
        condition: (_, siblingData) => siblingData?.overrideAll || siblingData?.overrideMapUrl,
      },
    },
  ],
}
