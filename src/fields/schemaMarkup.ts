import type { Field } from 'payload'

export const schemaMarkup: Field = {
  name: 'schema',
  type: 'array',
  label: 'Schema Markup',
  admin: {
    description: 'Add JSON-LD schema markup objects for this page.',
  },
  fields: [
    {
      name: 'data',
      type: 'json',
      required: true,
      label: 'Schema JSON',
    },
  ],
}
