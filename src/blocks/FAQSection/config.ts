import type { Block, Field } from 'payload'

import { link } from '@/fields/link'
import { sectionHeader } from '@/fields/sectionHeader'

export const FAQSection: Block = {
  slug: 'faqSection',
  interfaceName: 'FAQSectionBlock',
  labels: {
    singular: 'FAQ Section',
    plural: 'FAQ Section Blocks',
  },
  fields: [
    {
      name: 'overrideAll',
      type: 'checkbox',
      label: 'Override All Content',
      defaultValue: false,
      admin: {
        description: 'Enable to override all fields from the global FAQ Section.',
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
          name: 'overrideFaqs',
          type: 'checkbox',
          label: 'Override FAQs',
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
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faq',
      hasMany: true,
      maxRows: 8,
      label: 'FAQs',
      admin: {
        description: 'Select FAQs to display in this section.',
        condition: (_, siblingData) => siblingData?.overrideAll || siblingData?.overrideFaqs,
      },
    },
    link({
      overrides: {
        label: 'CTA Link',
        admin: {
          condition: (_, siblingData) => siblingData?.overrideAll,
        },
      },
    }),
  ],
}
