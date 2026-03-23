import type { Block } from 'payload'

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
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
    },
    link({
      appearances: false,
    }),
  ],
}
