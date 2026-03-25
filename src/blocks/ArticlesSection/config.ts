import type { Block } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'
import { link } from '@/fields/link'

export const ArticlesSection: Block = {
  slug: 'articlesSection',
  interfaceName: 'ArticlesSectionBlock',
  labels: {
    singular: 'Articles Section',
    plural: 'Articles Section Blocks',
  },
  fields: [
    {
      name: 'overrideAll',
      type: 'checkbox',
      label: 'Override All Content',
      defaultValue: false,
      admin: {
        description: 'Enable to override all fields from the global Articles Section.',
      },
    },
    {
      name: 'overrideSectionHeader',
      type: 'checkbox',
      label: 'Override Section Header',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => !siblingData?.overrideAll,
      },
    },
    {
      ...sectionHeader(),
      admin: {
        ...sectionHeader().admin,
        condition: (_, siblingData) =>
          siblingData?.overrideAll || siblingData?.overrideSectionHeader,
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
