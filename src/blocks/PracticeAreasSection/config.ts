import type { Block } from 'payload'
import type { PracticeArea } from '@/payload-types'

import { link } from '@/fields/link'
import { sectionHeader } from '@/fields/sectionHeader'

export const PracticeAreasSection: Block = {
  slug: 'practiceAreasSection',
  interfaceName: 'PracticeAreasSectionBlock',
  labels: {
    singular: 'Practice Areas Section',
    plural: 'Practice Areas Sections',
  },
  fields: [
    sectionHeader(),
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      label: 'Populate By',
      options: [
        {
          label: 'All Practice Areas',
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
      name: 'selectedPracticeAreas',
      type: 'relationship',
      relationTo: 'practice-areas',
      hasMany: true,
      label: 'Select Practice Areas',
      hooks: {
        afterRead: [
          async ({
            value,
            req,
          }): Promise<Partial<PracticeArea>[] | (string | PracticeArea)[] | null | undefined> => {
            if (!value || !Array.isArray(value) || value.length === 0) return value

            const ids = value.map((item: string | PracticeArea) =>
              typeof item === 'object' ? item.id : item,
            )

            const { docs } = await req.payload.find({
              collection: 'practice-areas',
              where: { id: { in: ids } },
              select: {
                title: true,
                slug: true,
                general: true,
              },
              limit: ids.length,
            })

            return ids.map((id) => docs.find((doc) => doc.id === id)).filter((doc): doc is NonNullable<typeof doc> => doc != null)
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
