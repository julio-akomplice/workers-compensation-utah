import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { headers } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'

import type { Header as HeaderType } from '@/payload-types'

export async function Header() {
  const headerData = (await getCachedGlobal('header', 1)()) as HeaderType

  // Get solidMenu from the current page so the header renders with the correct
  // background on the server — no flash
  let solidMenu = false
  try {
    const headersList = await headers()
    const pathname = headersList.get('x-nextjs-page') || headersList.get('x-invoke-path') || ''
    const slug = pathname.replace(/^\//, '') || 'home'
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      select: { solidMenu: true },
      where: { slug: { equals: slug } },
    })
    solidMenu = result.docs?.[0]?.solidMenu ?? false
  } catch {
    // Fallback to false if anything fails
  }

  return <HeaderClient data={headerData} initialSolidMenu={solidMenu} />
}
