import type { Block } from 'payload'

import { link } from '@/fields/link'
import { sectionHeader } from '@/fields/sectionHeader'

export const LandingPageCallToActionSection: Block = {
  slug: 'landingPageCallToActionSection',
  interfaceName: 'LandingPageCallToActionSectionBlock',
  labels: {
    singular: 'Call To Action Section',
    plural: 'Call To Action Sections',
  },
  fields: [
    sectionHeader({
      overrides: {
        admin: {
          description:
            'Use Supportive Text for the gold eyebrow caption, an H2 for the heading, and a paragraph for the body copy.',
        },
      },
    }),
    {
      name: 'phoneLabel',
      type: 'text',
      required: true,
      defaultValue: '(801) 424-WORK (9675)',
      admin: {
        description: 'Label for the gradient phone button (e.g. "(801) 424-WORK (9675)").',
      },
    },
    link({
      appearances: ['outline'],
      overrides: {
        label: 'Secondary CTA Link',
      },
    }),
  ],
}
