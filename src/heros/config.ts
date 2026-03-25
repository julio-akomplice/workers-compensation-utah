import type { Field } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'mediumImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Home Hero',
          value: 'homeHero',
        },
      ],
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      admin: {
        condition: (_, { type } = {}) => type === 'mediumImpact',
      },
    },
    {
      name: 'supportiveText',
      type: 'text',
      label: 'Supportive Text',
      admin: {
        condition: (_, { type } = {}) => type === 'homeHero',
      },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { type } = {}) => type === 'homeHero',
        },
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['mediumImpact', 'homeHero'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
