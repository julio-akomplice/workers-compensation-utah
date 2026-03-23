import type { Field, GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'

type SectionHeaderOptions = {
  supportiveText?: boolean
  headline?: boolean
  content?: boolean
  overrides?: Partial<GroupField>
}

const defaults: Required<Omit<SectionHeaderOptions, 'overrides'>> = {
  supportiveText: true,
  headline: true,
  content: true,
}

export const sectionHeader = (options: SectionHeaderOptions = {}): Field => {
  const opts = { ...defaults, ...options }

  const fields: Field[] = []

  if (opts.supportiveText) {
    fields.push({
      name: 'supportiveText',
      type: 'text',
      label: 'Supportive Text',
    })
  }

  if (opts.headline) {
    fields.push({
      name: 'headline',
      type: 'text',
      label: 'Headline',
    })
  }

  if (opts.content) {
    fields.push({
      name: 'content',
      type: 'textarea',
      label: 'Content',
    })
  }

  const result: GroupField = {
    name: 'sectionHeader',
    type: 'group',
    label: 'Section Header',
    fields,
  }

  return deepMerge(result, options.overrides ?? {})
}
