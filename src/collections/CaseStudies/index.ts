import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  trash: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['category', 'settlementAmount', 'updatedAt'],
    useAsTitle: 'displayTitle',
  },
  fields: [
    {
      name: 'displayTitle',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            return `${siblingData.category || ''} - ${siblingData.settlementAmount || ''}`
          },
        ],
      },
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      label: 'Category',
      admin: {
        description: 'e.g. "Workers Compensation Settlement"',
      },
    },
    {
      name: 'alternativeCategory',
      type: 'textarea',
      label: 'Alternative Category',
    },
    {
      name: 'settlementAmount',
      type: 'text',
      required: true,
      label: 'Settlement Amount',
      admin: {
        description: 'e.g. "$2,000,000"',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Description',
      admin: {
        description: 'Brief description of the case',
      },
    },
  ],
}
