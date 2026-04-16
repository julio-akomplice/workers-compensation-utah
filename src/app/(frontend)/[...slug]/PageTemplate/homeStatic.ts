import type { RequiredDataFromCollectionSlug } from 'payload'
import { SITE_NAME, SITE_DESCRIPTION } from '@/constants/site'

export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'mediumImpact',
    title: 'Home',
  },
  meta: {
    description: SITE_DESCRIPTION,
    title: SITE_NAME,
  },
  title: 'Home',
  layout: [],
}
