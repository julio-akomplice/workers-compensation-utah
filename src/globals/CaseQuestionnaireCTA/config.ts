import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { sectionHeader } from '@/fields/sectionHeader'
import { revalidateCaseQuestionnaireCTA } from './hooks/revalidateCaseQuestionnaireCTA'

export const CaseQuestionnaireCTA: GlobalConfig = {
  slug: 'case-questionnaire-cta',
  label: 'Case Questionnaire CTA',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Global Components',
  },
  fields: [
    sectionHeader(),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    link({
      overrides: {
        label: 'CTA Link',
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateCaseQuestionnaireCTA],
  },
}
