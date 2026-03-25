import type { Block } from 'payload'

export const Breadcrumb: Block = {
  slug: 'breadcrumb',
  interfaceName: 'BreadcrumbBlock',
  labels: {
    singular: 'Breadcrumb',
    plural: 'Breadcrumbs',
  },
  fields: [
    {
      name: 'theme',
      type: 'select',
      label: 'Theme',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Off White', value: 'offWhite' },
      ],
    },
    {
      name: 'pages',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: true,
      required: true,
      label: 'Pages',
      admin: {
        description: 'Select the pages for the breadcrumb trail. Home is always included as the first item.',
      },
    },
  ],
}
