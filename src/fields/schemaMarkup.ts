import type { Field } from 'payload'

export const schemaMarkup: Field = {
  name: 'schema',
  type: 'array',
  label: 'Schema Markup',
  admin: {
    description:
      'Page-specific JSON-LD only. Business details (name, phone, address, logo), URLs, dates and breadcrumbs are generated automatically from Business Info and this page’s fields. A block with the same @type as the generated one (e.g. LegalService) is merged into it: use it for name, description, areaServed, knowsAbout or serviceType. Other blocks (e.g. FAQPage on a blog post) are added as-is.',
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
