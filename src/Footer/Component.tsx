import React from 'react'

import type { Footer as FooterType } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { FooterContent } from './FooterContent'

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 2)()) as FooterType

  return <FooterContent {...footerData} />
}
