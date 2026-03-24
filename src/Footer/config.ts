import type { GlobalConfig } from 'payload'

import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    // Navigation Group
    {
      type: 'collapsible',
      label: 'Navigation',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'practiceAreaLinks',
          type: 'relationship',
          relationTo: 'practice-areas',
          hasMany: true,
          label: 'Practice Area Links',
          admin: {
            description: 'Select practice areas to display in the footer.',
          },
        },
        {
          name: 'areasServed',
          type: 'relationship',
          relationTo: 'areas-served',
          hasMany: true,
          label: 'Areas Served',
          admin: {
            description: 'Select areas served to display in the footer.',
          },
        },
        {
          name: 'quickLinks',
          type: 'relationship',
          relationTo: 'pages',
          hasMany: true,
          label: 'Quick Links',
          admin: {
            description: 'Select pages to display in the footer quick links.',
          },
        },
      ],
    },

    // Contact Group
    {
      type: 'collapsible',
      label: 'Contact',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'phone',
          type: 'group',
          label: 'Phone',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Display Text',
              defaultValue: '(801) 555-1234',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'Phone Link',
              admin: {
                description: 'e.g. tel:+18015551234',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Icon Image',
            },
          ],
        },
        {
          name: 'fax',
          type: 'group',
          label: 'Fax',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Display Text',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'Fax Link',
              admin: {
                description: 'e.g. fax:+18015551234',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Icon Image',
            },
          ],
        },
        {
          name: 'address',
          type: 'group',
          label: 'Address',
          fields: [
            {
              name: 'text',
              type: 'textarea',
              required: true,
              label: 'Address Text',
            },
            {
              name: 'mapUrl',
              type: 'text',
              label: 'Map URL',
              admin: {
                description: 'Google Maps link for the address.',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Icon Image',
            },
          ],
        },
        {
          name: 'socialLinks',
          type: 'array',
          label: 'Social Links',
          maxRows: 10,
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Name',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'URL',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Icon Image',
            },
          ],
        },
      ],
    },

    // Branding Group
    {
      type: 'collapsible',
      label: 'Branding',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Footer Logo',
        },
      ],
    },

    // Bottom Section Group
    {
      type: 'collapsible',
      label: 'Bottom Section',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          label: 'Copyright Text',
          defaultValue: "Workers' Compensation Utah",
          admin: {
            description: 'Text displayed after the copyright year (year is auto-generated).',
          },
        },
        {
          name: 'allRightsReservedText',
          type: 'text',
          label: 'Rights Reserved Text',
          defaultValue: 'All Rights Reserved',
        },
        {
          name: 'privacyPolicyPage',
          type: 'relationship',
          relationTo: 'pages',
          label: 'Privacy Policy Page',
        },
        {
          name: 'privacyPolicyLabel',
          type: 'text',
          label: 'Privacy Policy Label',
          defaultValue: 'Privacy Policy',
        },
        {
          name: 'legalMarketingText',
          type: 'text',
          label: 'Legal Marketing Text',
          defaultValue: 'Website and Legal Marketing by Legal Akomplice',
        },
        {
          name: 'legalMarketingUrl',
          type: 'text',
          label: 'Legal Marketing URL',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
