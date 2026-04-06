import type { Block } from 'payload'
import type { CaseStudy } from '@/payload-types'

import { sectionHeader } from '@/fields/sectionHeader'
import { link } from '@/fields/link'

export const CaseStudyPageBlock: Block = {
  slug: 'caseStudyPage',
  interfaceName: 'CaseStudyPageBlock',
  labels: {
    singular: 'Case Study Page',
    plural: 'Case Study Page Blocks',
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
      defaultValue: 10,
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
                limit: siblingData.limit || 10,
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
  ],
}
