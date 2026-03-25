import type { Block } from 'payload'
import type { CaseStudy } from '@/payload-types'

import { link } from '@/fields/link'
import { sectionHeader } from '@/fields/sectionHeader'

export const HomeCaseStudiesSection: Block = {
  slug: 'homeCaseStudiesSection',
  interfaceName: 'HomeCaseStudiesSectionBlock',
  labels: {
    singular: 'Home Case Studies Section',
    plural: 'Home Case Studies Sections',
  },
  fields: [
    sectionHeader(),
    sectionHeader({ overrides: { name: 'sectionHeaderMobile', label: 'Section Header (Mobile)' } }),
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      label: 'Populate By',
      options: [
        {
          label: 'All Case Studies',
          value: 'collection',
        },
        {
          label: 'Individual Selection',
          value: 'selection',
        },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 4,
      label: 'Limit',
    },
    {
      name: 'selectedCaseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      label: 'Select Case Studies',
      hooks: {
        afterRead: [
          async ({ value, req, siblingData }) => {
            if (siblingData.populateBy === 'collection') {
              const { docs } = await req.payload.find({
                collection: 'case-studies',
                limit: siblingData.limit || 4,
                sort: '-createdAt',
              })
              return docs
            }

            if (!value || !Array.isArray(value) || value.length === 0) return value

            const ids = value.map((item: string | CaseStudy) =>
              typeof item === 'object' ? item.id : item,
            )

            const { docs } = await req.payload.find({
              collection: 'case-studies',
              where: { id: { in: ids } },
              limit: ids.length,
            })

            return docs
          },
        ],
      },
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
    },
    link({}),
  ],
}
