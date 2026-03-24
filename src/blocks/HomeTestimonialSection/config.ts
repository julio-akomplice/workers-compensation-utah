import type { Block } from 'payload'

import { link } from '@/fields/link'
import { sectionHeader } from '@/fields/sectionHeader'

export const HomeTestimonialSection: Block = {
  slug: 'homeTestimonialSection',
  interfaceName: 'HomeTestimonialSectionBlock',
  labels: {
    singular: 'Home Testimonial Section',
    plural: 'Home Testimonial Sections',
  },
  fields: [
    sectionHeader(),
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      maxRows: 3,
      label: 'Testimonials',
      admin: {
        description: 'Select up to 3 testimonials to display.',
      },
    },
    link({
      overrides: {
        label: 'CTA Link',
      },
    }),
    {
      name: 'videos',
      type: 'array',
      label: 'Video Testimonials',
      minRows: 2,
      maxRows: 2,
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
          filterOptions: {
            mimeType: { contains: 'video' },
          },
        },
        {
          name: 'poster',
          type: 'upload',
          relationTo: 'media',
          filterOptions: {
            mimeType: { contains: 'image' },
          },
        },
      ],
    },
  ],
}
