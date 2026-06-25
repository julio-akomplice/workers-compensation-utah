import type { Block } from 'payload'
import {
  BoldFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  ParagraphFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const LandingPageHero01: Block = {
  slug: 'landingPageHero01',
  interfaceName: 'LandingPageHero01Block',
  labels: {
    singular: 'Landing Page Hero 01',
    plural: 'Landing Page Hero 01 Blocks',
  },
  fields: [
    {
      name: 'background',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Background Image',
    },
    {
      type: 'collapsible',
      label: 'Headline',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'headlineImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Headline Image',
          admin: {
            description: 'The visible headline graphic, e.g. "INJURED at Work in Utah?".',
          },
        },
        {
          name: 'headlineText',
          type: 'text',
          required: true,
          label: 'Headline Text (SEO)',
          admin: {
            description:
              'Visually hidden H1 for SEO and screen readers. Should match the headline image text, e.g. "Injured at Work in Utah?".',
          },
        },
        {
          name: 'supportiveLead',
          type: 'text',
          admin: { description: 'Bold, white lead-in for the supportive sentence.' },
        },
        {
          name: 'supportiveText',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'bullets',
      type: 'richText',
      label: 'Bullet Points',
      admin: {
        description:
          'Use a bulleted list. Bold the lead-in of each point to render it in white (the rest is shown in light navy).',
      },
      editor: lexicalEditor({
        features: [
          ParagraphFeature(),
          BoldFeature(),
          UnorderedListFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      type: 'collapsible',
      label: 'Form',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'formHeading',
          type: 'text',
        },
        {
          name: 'formSubheading',
          type: 'text',
        },
        {
          name: 'form',
          type: 'relationship',
          relationTo: 'forms',
          required: true,
        },
        {
          name: 'formDisclaimer',
          type: 'textarea',
        },
      ],
    },
  ],
}
