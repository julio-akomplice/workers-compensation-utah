import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { sectionHeader } from '@/fields/sectionHeader'
import { revalidateArticlesSection } from './hooks/revalidateArticlesSection'

export const ArticlesSectionGlobal: GlobalConfig = {
  slug: 'articles-section',
  label: 'Articles Section',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Global Components',
  },
  fields: [
    sectionHeader(),
    link({
      overrides: {
        label: 'CTA Link',
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateArticlesSection],
  },
}
