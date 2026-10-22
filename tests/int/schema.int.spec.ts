import { beforeAll, describe, expect, it } from 'vitest'

import type { BusinessInfo } from '@/payload-types'
import { buildPageSchema, buildSiteSchema } from '@/utilities/schema'

const SITE = 'https://workerscompensationutah.com'

const business: BusinessInfo = {
  id: 'business',
  name: 'Workers Compensation Utah',
  telephone: '+1-801-424-9675',
  faxNumber: '+1-801-683-7575',
  address: {
    streetAddress: '2046 E Murray Holladay Rd #108',
    addressLocality: 'Holladay',
    addressRegion: 'UT',
    postalCode: '84117',
    addressCountry: 'US',
  },
  areaServed: 'Utah',
  priceDescription: 'Contingency fee — no win, no fee',
  founder: { name: 'Richard Burke', jobTitle: 'Attorney', memberOf: 'College of Workers’ Compensation Lawyers' },
}

const staleBusinessFields = {
  telephone: '801-424-9675',
  address: { '@type': 'PostalAddress', streetAddress: '2046 E. Murray Holladay Rd' },
}

beforeAll(() => {
  process.env.NEXT_PUBLIC_SERVER_URL = SITE
})

describe('buildSiteSchema', () => {
  it('renders the organization and website nodes from Business Info', () => {
    const [org, website] = buildSiteSchema(business)

    expect(org).toMatchObject({
      '@type': 'LegalService',
      '@id': `${SITE}/#organization`,
      name: 'Workers Compensation Utah',
      telephone: '+1-801-424-9675',
      address: { '@type': 'PostalAddress', streetAddress: '2046 E Murray Holladay Rd #108' },
      areaServed: { '@type': 'State', name: 'Utah' },
    })
    expect(website).toMatchObject({ '@type': 'WebSite', publisher: { '@id': `${SITE}/#organization` } })
  })

  it('renders nothing until Business Info is filled in', () => {
    expect(buildSiteSchema(null)).toEqual([])
  })
})

describe('buildPageSchema', () => {
  it('merges a stored Article block into the generated BlogPosting, keeping generated values', () => {
    const nodes = buildPageSchema({
      business,
      page: {
        type: 'BlogPosting',
        url: '/blogs/my-post',
        headline: 'My Post',
        description: 'Meta description',
        datePublished: '2026-10-20T15:00:00.000Z',
        dateModified: '2026-10-19T15:00:00.000Z',
      },
      breadcrumbs: [{ label: 'Legal Insights & Case Updates', href: '/blogs' }, { label: 'My Post' }],
      stored: [
        {
          data: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Old headline',
            description: 'Old description',
            url: `${SITE}/blogs/old-slug`,
            datePublished: '2020-01-01',
            keywords: 'workers comp',
          },
        },
        { data: { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] } },
      ],
    })

    expect(nodes.map((n) => n['@type'])).toEqual(['BlogPosting', 'BreadcrumbList', 'FAQPage'])
    expect(nodes[0]).toMatchObject({
      '@context': 'https://schema.org',
      headline: 'My Post',
      description: 'Meta description',
      url: `${SITE}/blogs/my-post`,
      datePublished: '2026-10-20T15:00:00.000Z',
      // never earlier than the publish date
      dateModified: '2026-10-20T15:00:00.000Z',
      keywords: 'workers comp',
      author: { '@id': `${SITE}/#organization`, name: 'Workers Compensation Utah' },
    })
    expect(nodes[1]).toMatchObject({
      itemListElement: [
        { position: 1, name: 'Home', item: `${SITE}/` },
        { position: 2, item: `${SITE}/blogs` },
        { position: 3, name: 'My Post', item: `${SITE}/blogs/my-post` },
      ],
    })
  })

  it('keeps page-specific LegalService fields but always takes business details from the global', () => {
    const [node] = buildPageSchema({
      business,
      page: { type: 'LegalService', url: '/layton-ut/personal-injury-lawyer', name: 'Layton Personal Injury Lawyer', city: 'Layton' },
      stored: [
        {
          data: {
            '@type': 'LegalService',
            name: 'Layton PI Lawyer',
            url: `${SITE}/layton-ut/personal-injury-lawyer/`,
            knowsAbout: ['Personal Injury'],
            ...staleBusinessFields,
          },
        },
      ],
    })

    expect(node).toMatchObject({
      name: 'Workers Compensation Utah — Layton PI Lawyer',
      url: `${SITE}/layton-ut/personal-injury-lawyer`,
      knowsAbout: ['Personal Injury'],
      telephone: '+1-801-424-9675',
      address: { streetAddress: '2046 E Murray Holladay Rd #108', postalCode: '84117' },
      areaServed: { '@type': 'City', name: 'Layton', containedInPlace: { '@type': 'State', name: 'Utah' } },
      founder: { name: 'Richard Burke' },
    })
  })

  it('generates the FAQPage from the question and answer fields', () => {
    const [node] = buildPageSchema({
      business,
      page: {
        type: 'FAQPage',
        url: '/faq/how-long',
        questions: [
          {
            question: 'How long?',
            answer: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', text: 'Thirty days.', version: 1 }],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            } as never,
          },
        ],
      },
      stored: [{ data: { '@type': 'FAQPage', mainEntity: [{ name: 'Stale question' }] } }],
    })

    expect(node).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How long?', acceptedAnswer: { '@type': 'Answer', text: 'Thirty days.' } },
      ],
    })
  })

  it('passes stored schema through unchanged when Business Info is empty', () => {
    const nodes = buildPageSchema({
      business: null,
      stored: [{ data: { '@type': 'WebPage', name: 'About' } }],
    })

    expect(nodes).toEqual([{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'About' }])
  })
})
