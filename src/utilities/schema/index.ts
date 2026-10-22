import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

import type { BreadcrumbItem } from '@/components/Breadcrumbs'
import type { BusinessInfo, Media } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

export type SchemaNode = { [key: string]: unknown }

export type StoredSchema = { data: unknown; id?: string | null }[] | null | undefined

/**
 * Describes the primary schema node for a page. The values come from the
 * page's own fields (title, slug, dates, hero image…) so they can't drift
 * out of sync with what the page actually shows.
 */
export type PageSchemaInput =
  | {
      type: 'BlogPosting'
      url: string
      headline: string
      description?: string | null
      image?: string | Media | null
      datePublished?: string | null
      dateModified?: string | null
    }
  | {
      type: 'LegalService'
      url: string
      /** The service, without the business name, e.g. "Personal Injury Lawyer". */
      name?: string | null
      description?: string | null
      /** City name for location pages; omitted for state-wide pages. */
      city?: string | null
    }
  | {
      type: 'FAQPage'
      url: string
      questions: { question: string; answer?: DefaultTypedEditorState | null }[]
    }

const BUSINESS_TYPES = ['LegalService', 'Attorney', 'LocalBusiness', 'ProfessionalService', 'Organization']

// Page-specific keys a stored `meta.schema` block may set on a generated
// business node. Every other key the generator sets (urls, dates, business
// details) always wins, so stale copies in stored JSON can't override it.
const PAGE_OVERRIDES = ['name', 'description', 'areaServed', 'knowsAbout', 'serviceType']

const siteURL = () => getServerSideURL().replace(/\/$/, '')

const absoluteURL = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${siteURL()}${path.startsWith('/') ? '' : '/'}${path}`

export const organizationId = () => `${siteURL()}/#organization`
export const websiteId = () => `${siteURL()}/#website`

/** Drops empty values so optional fields don't render as null in JSON-LD. */
const compact = (node: SchemaNode): SchemaNode =>
  Object.fromEntries(
    Object.entries(node).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0),
    ),
  )

// Older posts store an `Article` block; treat it as the same node as the
// generated `BlogPosting` so it's merged rather than duplicated.
const ARTICLE_TYPES = ['Article', 'BlogPosting', 'NewsArticle']

const typesOf = (node: SchemaNode): string[] => {
  const type = node['@type']
  return (Array.isArray(type) ? type : [type]).filter((t): t is string => typeof t === 'string')
}

const sameType = (a: SchemaNode, b: SchemaNode) => {
  const family = (t: string) => (ARTICLE_TYPES.includes(t) ? 'Article' : t)
  const bTypes = typesOf(b).map(family)
  return typesOf(a).some((t) => bTypes.includes(family(t)))
}

const isBusinessNode = (node: SchemaNode) => typesOf(node).some((t) => BUSINESS_TYPES.includes(t))

const isNode = (value: unknown): value is SchemaNode =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const mediaURL = (media?: string | Media | null) =>
  typeof media === 'object' && media?.url ? absoluteURL(media.url) : undefined

const stateNode = (name: string) => ({ '@type': 'State', name })

const defaultAreaServed = (business: BusinessInfo) =>
  business.areaServed ? stateNode(business.areaServed) : undefined

/** Page business nodes are named "{Business} — {service}", e.g. "… — Layton Personal Injury Lawyer". */
const businessNodeName = (name: unknown, business: BusinessInfo) => {
  if (typeof name !== 'string' || !name.trim()) return business.name
  return name.startsWith(business.name) ? name : `${business.name} — ${name}`
}

/** Contact, location and credential details shared by every business node. */
const businessDetails = (business: BusinessInfo): SchemaNode => {
  const logo = mediaURL(business.logo)
  const { founder } = business

  return compact({
    telephone: business.telephone,
    faxNumber: business.faxNumber,
    email: business.email,
    address: compact({ '@type': 'PostalAddress', ...business.address }),
    hasMap: business.mapUrl,
    logo,
    image: logo,
    priceSpecification: business.priceDescription
      ? { '@type': 'UnitPriceSpecification', description: business.priceDescription }
      : undefined,
    founder: founder?.name
      ? compact({
          '@type': 'Person',
          name: founder.name,
          jobTitle: founder.jobTitle,
          memberOf: founder.memberOf ? { '@type': 'Organization', name: founder.memberOf } : undefined,
        })
      : undefined,
    sameAs: business.sameAs?.map(({ url }) => url),
  })
}

const organizationRef = (business: BusinessInfo) => ({
  '@type': 'Organization',
  '@id': organizationId(),
  name: business.name,
  url: `${siteURL()}/`,
})

/** Site-wide nodes rendered on every page; other nodes reference them by `@id`. */
export const buildSiteSchema = (business: BusinessInfo | null): SchemaNode[] => {
  if (!business?.name) return []

  return [
    compact({
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      '@id': organizationId(),
      name: business.name,
      url: `${siteURL()}/`,
      description: business.description,
      areaServed: defaultAreaServed(business),
      ...businessDetails(business),
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': websiteId(),
      url: `${siteURL()}/`,
      name: business.name,
      publisher: { '@id': organizationId() },
    },
  ]
}

const buildPageNode = (page: PageSchemaInput, business: BusinessInfo | null): SchemaNode => {
  const url = absoluteURL(page.url)

  switch (page.type) {
    case 'BlogPosting': {
      const author = business?.name ? organizationRef(business) : undefined
      const logo = business ? mediaURL(business.logo) : undefined
      // A save before the scheduled publish date would otherwise make the
      // post look modified before it was published.
      const dateModified =
        page.dateModified && page.datePublished && page.dateModified < page.datePublished
          ? page.datePublished
          : page.dateModified

      return compact({
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: page.headline,
        description: page.description,
        url,
        mainEntityOfPage: url,
        image: mediaURL(page.image),
        datePublished: page.datePublished,
        dateModified,
        author,
        publisher: author && compact({ ...author, logo: logo && { '@type': 'ImageObject', url: logo } }),
        isPartOf: { '@id': websiteId() },
      })
    }

    case 'LegalService':
      return compact({
        '@type': 'LegalService',
        '@id': `${url}#legalservice`,
        name: page.name,
        description: page.description,
        url,
        areaServed:
          page.city && business?.areaServed
            ? { '@type': 'City', name: page.city, containedInPlace: stateNode(business.areaServed) }
            : undefined,
      })

    case 'FAQPage':
      return {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        url,
        mainEntity: page.questions.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer ? convertLexicalToPlaintext({ data: answer }).trim() : '',
          },
        })),
      }
  }
}

const buildBreadcrumbList = (items: BreadcrumbItem[], pageURL: string): SchemaNode => ({
  '@type': 'BreadcrumbList',
  itemListElement: [{ label: 'Home', href: '/' }, ...items].map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: absoluteURL(item.href ?? pageURL),
  })),
})

/**
 * Builds a page's JSON-LD: the generated primary node and breadcrumbs, with
 * the page's stored `meta.schema` blocks layered on as page-specific extras.
 * A stored block of the same type as the generated node is merged into it;
 * other stored blocks render alongside. Business nodes always get their
 * contact details from the Business Info global.
 */
export const buildPageSchema = ({
  business,
  page,
  breadcrumbs,
  stored,
}: {
  business: BusinessInfo | null
  page?: PageSchemaInput
  breadcrumbs?: BreadcrumbItem[]
  stored?: StoredSchema
}): SchemaNode[] => {
  const extras = (stored ?? []).flatMap(({ data }) => (Array.isArray(data) ? data : [data])).filter(isNode)

  const generated: SchemaNode[] = []
  if (page) generated.push(buildPageNode(page, business))
  if (page && breadcrumbs?.length) generated.push(buildBreadcrumbList(breadcrumbs, page.url))

  const merged = new Set<SchemaNode>()
  const nodes = generated.map((node) => {
    const match = extras.find((extra) => !merged.has(extra) && sameType(extra, node))
    if (!match) return node

    merged.add(match)
    const overrides = isBusinessNode(node)
      ? Object.fromEntries(Object.entries(match).filter(([key]) => PAGE_OVERRIDES.includes(key)))
      : {}
    return { ...match, ...node, ...overrides }
  })
  nodes.push(...extras.filter((extra) => !merged.has(extra)))

  return nodes.map((node) => {
    const { '@context': _context, ...rest } = node
    const enriched =
      business?.name && isBusinessNode(rest)
        ? {
            ...rest,
            name: businessNodeName(rest.name, business),
            areaServed: rest.areaServed ?? defaultAreaServed(business),
            ...businessDetails(business),
          }
        : rest

    return { '@context': 'https://schema.org', ...enriched }
  })
}
