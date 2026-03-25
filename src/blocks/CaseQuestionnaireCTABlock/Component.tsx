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
    <section className="w-full py-15 bg-off-white md:py-20 lg:py-25">
      <div className="container mx-auto px-5 md:px-8">
        <div className="relative overflow-hidden rounded-[10px] bg-linear-to-t from-[#001f3e] to-[#00172d] md:rounded-[15px] md:bg-linear-to-b">
          {/* Image */}
          <div className="relative h-43.25 w-full md:absolute md:inset-y-0 md:left-0 md:h-full md:w-83.5 lg:w-[45%]">
            <Media
              resource={image}
              imgClassName="w-full h-full object-cover"
              className="absolute inset-0 h-full"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-7.5 px-5 py-5 pb-5 md:ml-83.5 md:gap-8.75 md:justify-center md:py-12 md:pr-8 md:pl-10 lg:ml-[45%] lg:py-16">
            {sectionHeader && 'root' in sectionHeader && (
              <div className="section-header section-header--dark">
                <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
              </div>
            )}

            {link && (
              <div>
                <CMSLink {...link} className="w-full md:w-auto" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
