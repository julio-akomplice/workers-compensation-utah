import type { Block } from 'payload'

import { sectionHeader } from '@/fields/sectionHeader'

export const BlogPageBlock: Block = {
  slug: 'blogPage',
  interfaceName: 'BlogPageBlock',
  labels: {
    singular: 'Blog Page',
    plural: 'Blog Page Blocks',
  },
  fields: [
    sectionHeader(),
    {
      name: 'postsPerPage',
      type: 'number',
      label: 'Posts Per Page',
      defaultValue: 9,
      admin: {
        description: 'Number of posts to display per page',
      },
    },
  ],
}
