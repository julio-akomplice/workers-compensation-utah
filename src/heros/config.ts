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
    {
      name: 'headlineImage',
      type: 'upload',
      label: 'Headline Image',
      admin: {
        condition: (_, { type } = {}) => type === 'homeHero',
      },
      relationTo: 'media',
    },
    linkGroup({
      overrides: {
        minRows: 1,
        maxRows: 1,
        admin: {
          condition: (_, { type } = {}) => type === 'homeHero',
        },
      },
    }),
    {
      name: 'backgroundVideo',
      type: 'group',
      label: 'Background Video',
      admin: {
        condition: (_, { type } = {}) => type === 'homeHero',
        description: 'Optional video background. If provided, it will be used instead of the background image.',
      },
      fields: [
        {
          name: 'video',
          type: 'upload',
          label: 'Video',
          relationTo: 'media',
        },
        {
          name: 'poster',
          type: 'upload',
          label: 'Video Poster',
          relationTo: 'media',
          admin: {
            description: 'Poster image shown while the video loads.',
          },
        },
      ],
    },
    {
      name: 'background',
      type: 'upload',
      label: 'Background',
      admin: {
        condition: (_, { type } = {}) => ['mediumImpact', 'homeHero'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
