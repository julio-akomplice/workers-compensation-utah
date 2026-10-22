import type { GlobalConfig } from 'payload'

import { revalidateBusinessInfo } from './hooks/revalidateBusinessInfo'

/**
 * Single source of truth for the business details used in JSON-LD schema.
 * Every generated schema node (site-wide organization, practice areas, areas
 * served, blog authors/publishers) reads from here, so a change made once
 * updates every page.
 */
export const BusinessInfo: GlobalConfig = {
  slug: 'business-info',
  label: 'Business Info (SEO)',
  access: {
    read: () => true,
  },
  admin: {
    group: 'SEO',
    description:
      'Business details used to generate structured data (JSON-LD) on every page. Changes apply site-wide.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Business Name',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Business Description',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'telephone',
          type: 'text',
          required: true,
          admin: { description: 'International format, e.g. +1-801-424-9675' },
        },
        {
          name: 'faxNumber',
          type: 'text',
          label: 'Fax Number',
          admin: { description: 'International format, e.g. +1-801-683-7575' },
        },
        {
          name: 'email',
          type: 'email',
        },
      ],
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'streetAddress',
          type: 'text',
          required: true,
          label: 'Street Address',
        },
        {
          type: 'row',
          fields: [
            { name: 'addressLocality', type: 'text', required: true, label: 'City' },
            { name: 'addressRegion', type: 'text', required: true, label: 'State' },
            { name: 'postalCode', type: 'text', required: true, label: 'ZIP' },
            { name: 'addressCountry', type: 'text', defaultValue: 'US', label: 'Country' },
          ],
        },
      ],
    },
    {
      name: 'mapUrl',
      type: 'text',
      label: 'Google Maps URL',
    },
    {
      name: 'areaServed',
      type: 'text',
      defaultValue: 'Utah',
      label: 'Default Area Served (State)',
      admin: {
        description: 'Used when a page does not define its own area served.',
      },
    },
    {
      name: 'priceDescription',
      type: 'text',
      label: 'Fee Structure',
      admin: { description: 'e.g. Contingency fee — no win, no fee' },
    },
    {
      name: 'founder',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text' },
            { name: 'jobTitle', type: 'text', label: 'Job Title' },
          ],
        },
        {
          name: 'memberOf',
          type: 'text',
          label: 'Member Of',
          admin: { description: 'Professional organization, e.g. College of Workers’ Compensation Lawyers' },
        },
      ],
    },
    {
      name: 'sameAs',
      type: 'array',
      label: 'Profiles (sameAs)',
      admin: {
        description: 'Official profiles such as Google Business, Facebook, LinkedIn, Avvo.',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateBusinessInfo],
  },
}
