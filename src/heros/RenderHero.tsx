import React from 'react'

import type { Page } from '@/payload-types'

import { HomeHero } from '@/heros/HomeHero'
import { MediumImpactHero } from '@/heros/MediumImpact'

const heroes = {
  homeHero: HomeHero,
  mediumImpact: MediumImpactHero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
