import type { Block } from 'payload'

export const CaseQuestionnaireBlock: Block = {
  slug: 'caseQuestionnaire',
  interfaceName: 'CaseQuestionnaireBlock',
  labels: {
    singular: 'Case Questionnaire',
    plural: 'Case Questionnaire Blocks',
  },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
  ],
}
