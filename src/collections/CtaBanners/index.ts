import type { CollectionConfig } from 'payload'
import {
  BoldFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  UnderlineFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

export const CtaBanners: CollectionConfig = {
  slug: 'cta-banners',
  labels: {
    singular: 'CTA Banner',
    plural: 'CTA Banners',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal label for this banner (not displayed on the site)',
      },
    },
    {
      name: 'template',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: [
          ParagraphFeature(),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          LinkFeature({}),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        description:
          'The banner content. Use {{variableName}} for dynamic parts. Example: "For a Free Legal Consultation with a {{topic}} Lawyer, Call {{phone}}"',
      },
    },
    {
      name: 'variables',
      type: 'array',
      admin: {
        description:
          'Define the variables used in your template. These serve as a reference and provide default values when not overridden in the block.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Must match the {{name}} in your template exactly',
          },
        },
        {
          name: 'defaultValue',
          type: 'text',
          admin: {
            description: 'Default text if not overridden in the block instance',
          },
        },
        {
          name: 'isLink',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Default: wrap this variable in a link?',
          },
        },
        {
          name: 'href',
          type: 'text',
          admin: {
            description: 'Default link URL (e.g. tel:8014249675 or https://...)',
            condition: (_data, siblingData) => siblingData?.isLink,
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Default: open link in a new tab?',
            condition: (_data, siblingData) => siblingData?.isLink,
          },
        },
      ],
    },
  ],
}
