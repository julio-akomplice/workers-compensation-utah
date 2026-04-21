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
    <section className="w-full bg-off-white pt-[60px] pb-[60px] md:pt-[60px] md:pb-20 lg:pt-[60px] lg:pb-[100px]">
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
              <div className="w-full md:w-fit rounded-[10px] bg-light-gray">
                <div className="flex items-start px-[15px] py-[25px] md:px-[25px]">
                  {achievements.map((achievement, index) => (
                    <React.Fragment key={achievement.id || index}>
                      {index > 0 && (
                        <div className="mx-[15px] h-[63px] w-px self-center bg-navy-100 md:mx-[17px] lg:mx-[35px]" />
                      )}
                      <div className="flex min-w-0 flex-shrink flex-col items-center gap-2 px-[5px] text-center md:px-0 md:min-w-[100px] md:max-w-[160px]">
                        <p className="text-[32px] font-semibold leading-[36px] tracking-[-1.68px] text-navy-400 md:text-[42px] md:leading-[46px]">
                          {achievement.value}
                        </p>
                        <p className="text-[13px] font-normal leading-normal tracking-[-0.32px] text-deep-blue-800 md:text-[16px]">
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
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
