import React from 'react'

import type { CaseQuestionnaireCTABlock as CaseQuestionnaireCTABlockProps } from 'src/payload-types'

import { CaseQuestionnaireCTACard } from '@/components/CaseQuestionnaireCTACard'

type Props = {
  className?: string
} & CaseQuestionnaireCTABlockProps

async function fetchGlobal() {
  // Dynamic imports to avoid pulling @payload-config into the client bundle
  const [{ getPayload }, { default: configPromise }, { unstable_cache }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
    import('next/cache'),
  ])

  const getCached = unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      return payload.findGlobal({ slug: 'case-questionnaire-cta' })
    },
    ['global_case-questionnaire-cta'],
    { tags: ['global_case-questionnaire-cta'] },
  )

  return getCached()
}

export const CaseQuestionnaireCTAInlineBlock: React.FC<Props> = async ({
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
      className={className}
    />
  )
}
