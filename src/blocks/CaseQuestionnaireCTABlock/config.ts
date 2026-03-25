import type { Block } from 'payload'

import { link } from '@/fields/link'
import { sectionHeader } from '@/fields/sectionHeader'

export const CaseQuestionnaireCTABlock: Block = {
  slug: 'caseQuestionnaireCTA',
  interfaceName: 'CaseQuestionnaireCTABlock',
  labels: {
    singular: 'Case Questionnaire CTA',
    plural: 'Case Questionnaire CTA Blocks',
  },
  fields: [
    {
      name: 'overrideAll',
      type: 'checkbox',
      label: 'Override All Content',
      defaultValue: false,
      admin: {
        description: 'Enable to override all fields from the global CTA.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'overrideImage',
          type: 'checkbox',
          label: 'Override Image',
          defaultValue: false,
          admin: {
            condition: (_, siblingData) => !siblingData?.overrideAll,
            width: '33%',
          },
        },
        {
          name: 'overrideContent',
          type: 'checkbox',
          label: 'Override Content',
          defaultValue: false,
          admin: {
            condition: (_, siblingData) => !siblingData?.overrideAll,
            width: '33%',
          },
        },
        {
          name: 'overrideLink',
          type: 'checkbox',
          label: 'Override Link',
          defaultValue: false,
          admin: {
            condition: (_, siblingData) => !siblingData?.overrideAll,
            width: '33%',
          },
        },
      ],
    },
    // Override fields
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.overrideAll || siblingData?.overrideImage,
      },
    },
    sectionHeader({
      overrides: {
        admin: {
          condition: (_, siblingData) => siblingData?.overrideAll || siblingData?.overrideContent,
        },
      },
    }),
    link({
      overrides: {
        label: 'CTA Link',
        admin: {
          condition: (_, siblingData) => siblingData?.overrideAll || siblingData?.overrideLink,
        },
      },
    }),
  ],
}
