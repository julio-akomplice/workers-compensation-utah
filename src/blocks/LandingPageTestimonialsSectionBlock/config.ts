import type { Block } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'

export const LandingPageTestimonialsSection: Block = {
  slug: 'landingPageTestimonialsSection',
  interfaceName: 'LandingPageTestimonialsSectionBlock',
  labels: {
    singular: 'LP Testimonials Section',
    plural: 'LP Testimonials Sections',
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
  ],
}
