import type { Block } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'

export const LandingPageTestimonialsSection: Block = {
  slug: 'landingPageTestimonialsSection',
  interfaceName: 'LandingPageTestimonialsSectionBlock',
  labels: {
    singular: 'Testimonials Section',
    plural: 'Testimonials Sections',
  },
  fields: [
    sectionHeader(),
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      minRows: 1,
      maxRows: 6,
      labels: {
        singular: 'Testimonial',
        plural: 'Testimonials',
      },
      admin: {
        initCollapsed: true,
        description: 'Each card shows a client photo, name, rating and quote.',
      },
      fields: [
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Photo',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Shown under the name, e.g. "WCU Client".',
          },
        },
        {
          name: 'rating',
          type: 'number',
          required: true,
          min: 0,
          max: 5,
          admin: {
            description: 'Number of stars (0–5).',
          },
        },
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          label: 'Quote',
        },
      ],
    },
  ],
}
