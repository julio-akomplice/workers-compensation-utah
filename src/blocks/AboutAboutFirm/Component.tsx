import React from 'react'

import type { AboutAboutFirmBlock as AboutAboutFirmBlockProps } from 'src/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & AboutAboutFirmBlockProps

export const AboutAboutFirmBlock: React.FC<Props> = ({
  content,
  achievements,
  image,
  link,
}) => {
  return (
    <section className="w-full pt-[60px] pb-[60px] md:pt-[60px] md:pb-20 lg:pt-[60px] lg:pb-[100px]">
      <div className="container mx-auto px-5 md:px-8 lg:px-[204px]">
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-[101px]">
          {/* Content */}
          <div className="flex flex-col gap-10 lg:w-[676px] lg:shrink-0">
            {/* Rich Text Content */}
            {content && 'root' in content && (
              <div className="about-firm-content">
                <RichText data={content} enableGutter={false} enableProse={false} />
              </div>
            )}

            {/* Achievements */}
            {achievements && achievements.length > 0 && (
              <div className="w-fit rounded-[10px] bg-light-gray">
                <div className="flex items-center px-[25px] py-[25px]">
                  {achievements.map((achievement, index) => (
                    <React.Fragment key={achievement.id || index}>
                      {index > 0 && (
                        <div className="mx-[17px] h-[63px] w-px bg-navy-100 md:mx-[35px]" />
                      )}
                      <div className="flex w-full min-w-[100px] max-w-[160px] flex-col items-center gap-2 text-center">
                        <p className="text-[42px] font-semibold leading-[46px] tracking-[-1.68px] text-navy-400">
                          {achievement.value}
                        </p>
                        <p className="text-[16px] font-normal leading-normal tracking-[-0.32px] text-deep-blue-800">
                          {achievement.label}
                        </p>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Link */}
            {link && (
              <div>
                <CMSLink {...link} />
              </div>
            )}
          </div>

          {/* Image */}
          <div className="mt-10 lg:mt-0 lg:flex-1 lg:self-stretch">
            <div className="overflow-hidden rounded-[10px] h-[400px] md:h-[600px] lg:h-full">
              <Media
                resource={image}
                imgClassName="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
