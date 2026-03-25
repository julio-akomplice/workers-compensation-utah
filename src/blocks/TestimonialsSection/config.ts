import type { Block } from 'payload'

import { link } from '@/fields/link'
import { sectionHeader } from '@/fields/sectionHeader'

export const TestimonialsSection: Block = {
  slug: 'testimonialsSection',
  interfaceName: 'TestimonialsSectionBlock',
  labels: {
    singular: 'Testimonials Section',
    plural: 'Testimonials Sections',
  },
  fields: [
    sectionHeader(),
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      maxRows: 6,
      label: 'Testimonials',
      admin: {
        description: 'Select testimonials to display.',
      },
    },
    link({
      overrides: {
        label: 'CTA Link',
      },
    }),
  ],
}
