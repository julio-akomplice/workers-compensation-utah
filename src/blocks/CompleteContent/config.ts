import type { Block } from 'payload'

import { cardContent } from '@/fields/cardContent'
import { sectionHeader } from '@/fields/sectionHeader'

export const CompleteContent: Block = {
  slug: 'completeContentBlock',
  interfaceName: 'CompleteContentBlock',
  labels: {
    singular: 'Complete Content Block',
    plural: 'Complete Content Blocks',
  },
  fields: [
    sectionHeader(),
    cardContent(),
  ],
}
