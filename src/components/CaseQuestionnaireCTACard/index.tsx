import React from 'react'

import type { CaseQuestionnaireCta, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type Classes = {
  image?: string
  content?: string
}

type Props = {
  image: CaseQuestionnaireCta['image']
  sectionHeader: CaseQuestionnaireCta['sectionHeader']
  link: CaseQuestionnaireCta['link']
  className?: string
  classes?: Classes
}

export const CaseQuestionnaireCTACard: React.FC<Props> = ({
  image,
  sectionHeader,
  link,
  className,
  classes,
}) => {
  return (
    <div
      className={cn(
        'stop-a relative overflow-hidden rounded-[10px] bg-linear-to-t from-[#001f3e] to-[#00172d] md:rounded-[15px] md:bg-linear-to-b',
        className,
      )}
    >
      {/* Image */}
      <div className={cn("relative h-43.25 w-full md:absolute md:inset-y-0 md:left-0 md:h-full md:w-83.5 lg:w-[45%]", classes?.image)}>
        <Media
          resource={image}
          imgClassName="w-full h-full object-cover"
          className="absolute inset-0 h-full"
        />
      </div>

      {/* Content */}
      <div className={cn("flex flex-col gap-7.5 px-5 py-5 pb-5 md:ml-83.5 md:gap-8.75 md:justify-center md:py-12 md:pr-8 md:pl-10 lg:ml-[45%] lg:py-16", classes?.content)}>
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
  )
}
