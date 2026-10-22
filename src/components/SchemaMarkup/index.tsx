import React from 'react'

import type { BreadcrumbItem } from '@/components/Breadcrumbs'
import type { BusinessInfo } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import {
  buildPageSchema,
  buildSiteSchema,
  type PageSchemaInput,
  type SchemaNode,
  type StoredSchema,
} from '@/utilities/schema'

const getBusinessInfo = async () =>
  ((await getCachedGlobal('business-info', 1)()) as BusinessInfo | null) ?? null

const JsonLd: React.FC<{ nodes: SchemaNode[] }> = ({ nodes }) => (
  <>
    {nodes.map((node, index) => (
      <script
        key={index}
        type="application/ld+json"
        // Escape `<` so content can't close the script tag early
        dangerouslySetInnerHTML={{ __html: JSON.stringify(node).replace(/</g, '\\u003c') }}
      />
    ))}
  </>
)

type Props = {
  /** The page's stored `meta.schema` blocks (page-specific extras). */
  schema?: StoredSchema
  /** The page's primary node, generated from its fields. */
  page?: PageSchemaInput
  /** The same items passed to the visible `Breadcrumbs`. */
  breadcrumbs?: BreadcrumbItem[]
}

export async function SchemaMarkup({ schema, page, breadcrumbs }: Props) {
  const business = await getBusinessInfo()
  const nodes = buildPageSchema({ business, page, breadcrumbs, stored: schema })

  if (nodes.length === 0) return null

  return <JsonLd nodes={nodes} />
}

/** Site-wide organization and website nodes, rendered once per page by the layouts. */
export async function SiteSchema() {
  const nodes = buildSiteSchema(await getBusinessInfo())

  if (nodes.length === 0) return null

  return <JsonLd nodes={nodes} />
}
