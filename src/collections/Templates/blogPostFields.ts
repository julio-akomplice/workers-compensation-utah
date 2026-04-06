import type { GroupField } from 'payload'

import { link } from '../../fields/link'

export const blogPostFields: GroupField = {
  name: 'blogPost',
  type: 'group',
  label: 'Blog Post Content',
  admin: {
    condition: (data) => data?.templateType === 'blog-post',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Call to Action',
      admin: { initCollapsed: true },
      fields: [link()],
    },
    {
      type: 'collapsible',
      label: 'Fact Checked By',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'factCheckedBy',
          type: 'group',
          admin: { hideGutter: true },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g. "Content checked by Richard R. Burke"',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              admin: {
                description:
                  'Short bio or credentials of the person who reviewed the content.',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
