import React from 'react'

import type { CaseQuestionnaireCTABlock as CaseQuestionnaireCTABlockProps } from 'src/payload-types'

import { CaseQuestionnaireCTACard } from '@/components/CaseQuestionnaireCTACard'
import { getServerSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
} & CaseQuestionnaireCTABlockProps

async function fetchGlobal() {
  const url = `${getServerSideURL()}/api/globals/case-questionnaire-cta?depth=1`
  const res = await fetch(url, { next: { tags: ['global_case-questionnaire-cta'] } })
  if (!res.ok) return null
  return res.json()
}

export const CaseQuestionnaireCTALexicalBlock: React.FC<Props> = async ({
  className,
  overrideAll,
  overrideImage,
  overrideContent,
  overrideLink,
  image: overriddenImage,
  sectionHeader: overriddenSectionHeader,
  link: overriddenLink,
}) => {
  const global = await fetchGlobal()
  if (!global) return null

  const useOverrideImage = overrideAll || overrideImage
  const useOverrideContent = overrideAll || overrideContent
  const useOverrideLink = overrideAll || overrideLink

  const image = useOverrideImage && overriddenImage ? overriddenImage : global.image
  const sectionHeader =
    useOverrideContent && overriddenSectionHeader ? overriddenSectionHeader : global.sectionHeader
  const link = useOverrideLink && overriddenLink ? overriddenLink : global.link

  return (
    <CaseQuestionnaireCTACard
      image={image}
      sectionHeader={sectionHeader}
      link={link}
      className={cn('my-15', className)}
      classes={{
        image: 'md:w-72 lg:w-[38%]',
        content: 'md:ml-72 lg:ml-[38%]',
      }}
    />
  )
}
