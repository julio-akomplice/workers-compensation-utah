import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'

import type { CaseQuestionnaireCTABlock as CaseQuestionnaireCTABlockProps } from 'src/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & CaseQuestionnaireCTABlockProps

const getCaseQuestionnaireCTA = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'case-questionnaire-cta' })
  },
  ['global_case-questionnaire-cta'],
  { tags: ['global_case-questionnaire-cta'] },
)

export const CaseQuestionnaireCTABlockComponent: React.FC<Props> = async ({
  overrideAll,
  overrideImage,
  overrideContent,
  overrideLink,
  image: overriddenImage,
  sectionHeader: overriddenSectionHeader,
  link: overriddenLink,
}) => {
  const global = await getCaseQuestionnaireCTA()

  const useOverrideImage = overrideAll || overrideImage
  const useOverrideContent = overrideAll || overrideContent
  const useOverrideLink = overrideAll || overrideLink

  const image = useOverrideImage && overriddenImage ? overriddenImage : global.image
  const sectionHeader =
    useOverrideContent && overriddenSectionHeader ? overriddenSectionHeader : global.sectionHeader
  const link = useOverrideLink && overriddenLink ? overriddenLink : global.link

  return (
    <section className="w-full py-16 bg-off-white md:py-25">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 overflow-hidden rounded-[15px] lg:grid-cols-2">
          {/* Left: Image */}
          <div className="relative aspect-4/3 lg:aspect-auto">
            <div className="absolute inset-0">
              <Media
                resource={image}
                imgClassName="w-full h-full object-cover"
                className="h-full"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-center bg-deep-blue-1000 p-8 md:p-12 lg:p-16">
            {sectionHeader && 'root' in sectionHeader && (
              <div className="section-header section-header--dark">
                <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
              </div>
            )}

            {link && (
              <div className="mt-8">
                <CMSLink {...link} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
