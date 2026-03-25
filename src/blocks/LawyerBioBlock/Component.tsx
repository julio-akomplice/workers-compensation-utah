import React from 'react'

import type { LawyerBioBlockBlock as LawyerBioBlockProps } from 'src/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & LawyerBioBlockProps

export const LawyerBioBlock: React.FC<Props> = ({
  name,
  profilePicture,
  phone,
  fax,
  sectionHeader,
  achievements,
  bio,
}) => {
  return (
    <section className="w-full">
      {/* ===== MOBILE / TABLET: Stacked layout ===== */}
      <div className="lg:hidden">
        {/* Profile Card */}
        <div className="w-full md:px-12.25 md:pt-6">
          <div className="overflow-hidden md:rounded-[10px]">
            {/* Profile Image */}
            <div className="overflow-hidden">
              <div className="aspect-390/339 md:aspect-770/556">
                <Media
                  resource={profilePicture}
                  imgClassName="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Name + Phone/Fax Bar */}
            <div className="bg-off-white px-5 py-5 md:px-12.25">
              <div className="flex flex-col items-center gap-3.75 md:flex-row md:justify-center md:gap-15">
                <h2 className="text-[24px] font-semibold leading-7 tracking-[-0.72px] text-navy-800">
                  {name}
                </h2>
                <div className="flex items-center gap-5">
                  {phone?.link && (
                    <a href={phone.link} className="flex items-end gap-2.75">
                      {phone.icon && (
                        <div className="size-7 shrink-0 [&_svg]:size-full">
                          <Media resource={phone.icon} imgClassName="w-full h-full object-contain" />
                        </div>
                      )}
                      <span className="text-[16px] font-semibold leading-6 tracking-[-0.32px] text-navy-1000 md:text-[17px] md:leading-6.25 md:tracking-[-0.34px]">
                        {phone.label}
                      </span>
                    </a>
                  )}
                  <div className="h-5.5 w-0 border-l border-navy-200" />
                  {fax?.link && (
                    <a href={fax.link} className="flex items-end gap-2.75">
                      {fax.icon && (
                        <div className="size-7 shrink-0 [&_svg]:size-full">
                          <Media resource={fax.icon} imgClassName="w-full h-full object-contain" />
                        </div>
                      )}
                      <span className="text-[16px] font-semibold leading-6 tracking-[-0.32px] text-navy-1000 md:text-[17px] md:leading-6.25 md:tracking-[-0.34px]">
                        {fax.label}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Logos */}
        {achievements && achievements.length > 0 && (
          <div className="overflow-hidden bg-white px-3.25 py-5 md:px-7.75 md:py-2.5">
            <div className="flex items-center justify-center gap-4.25 md:gap-9.25">
              {achievements.map((achievement, index) => (
                <div
                  key={achievement.id || index}
                  className="h-[45px] w-[78px] shrink md:h-24 md:w-41.25"
                >
                  <Media
                    resource={achievement.image}
                    imgClassName="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Header + Bio */}
        <div className="bg-white px-5 pb-15 pt-7.5 md:px-8 md:pb-20 md:pt-15">
          <div className="mx-auto max-w-87.5 md:max-w-192.5">
            {sectionHeader && 'root' in sectionHeader && (
              <div className="section-header lawyer-bio-section-header">
                <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
              </div>
            )}
            {bio && 'root' in bio && (
              <div className="lawyer-bio-content mt-8.75">
                <RichText data={bio} enableGutter={false} enableProse={false} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== DESKTOP: 2-column layout ===== */}
      <div className="hidden lg:block">
        <div className="mx-auto flex max-w-[1320px] items-start gap-18.5 pb-25 pt-15">
          {/* Left Column: Profile Card (sticky, aligned to content end) */}
          <div className="sticky top-25 w-119 shrink-0 self-start">
            <div className="overflow-hidden rounded-[10px] bg-white">
              {/* White top spacer */}
              <div className="h-10.25 w-full bg-white" />

              {/* Profile Image */}
              <div className="h-[712px] rounded-t-[10px] overflow-hidden">
                <Media
                  resource={profilePicture}
                  imgClassName="w-full h-full object-cover object-top"
                />
              </div>

              {/* Name + Phone/Fax Bar */}
              <div className="bg-off-white rounded-b-[8px] px-9.25 pb-7.75 pt-5">
                <p className="mb-3.75 text-center text-[24px] font-semibold leading-7 tracking-[-0.72px] text-navy-800">
                  {name}
                </p>
                <div className="flex items-center justify-center gap-5">
                  {phone?.link && (
                    <a href={phone.link} className="flex items-end gap-2.75">
                      {phone.icon && (
                        <div className="size-7 shrink-0 [&_svg]:size-full [&_path]:fill-[#FA681C]">
                          <Media resource={phone.icon} imgClassName="w-full h-full object-contain [&_svg]:size-full [&_path]:fill-[#FA681C]" />
                        </div>
                      )}
                      <span className="text-[16px] font-semibold leading-6 tracking-[-0.32px] text-navy-1000">
                        {phone.label}
                      </span>
                    </a>
                  )}
                  <div className="h-5.5 w-0 border-l border-navy-50" />
                  {fax?.link && (
                    <a href={fax.link} className="flex items-end gap-2.75">
                      {fax.icon && (
                        <div className="size-7 shrink-0 [&_svg]:size-full [&_path]:fill-[#FA681C]">
                          <Media resource={fax.icon} imgClassName="w-full h-full object-contain [&_svg]:size-full [&_path]:fill-[#FA681C]" />
                        </div>
                      )}
                      <span className="text-[16px] font-semibold leading-6 tracking-[-0.32px] text-navy-1000">
                        {fax.label}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="min-w-0 flex-1">
            {/* Section Header (caption + name heading) */}
            {sectionHeader && 'root' in sectionHeader && (
              <div className="section-header lawyer-bio-section-header">
                <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
              </div>
            )}

            {/* Achievement Logos */}
            {achievements && achievements.length > 0 && (
              <div className="mt-8.75 overflow-hidden">
                <div className="flex items-center gap-7.5">
                  {achievements.map((achievement, index) => (
                    <div
                      key={achievement.id || index}
                      className="h-19.75 w-34 shrink"
                    >
                      <Media
                        resource={achievement.image}
                        imgClassName="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bio Rich Text */}
            {bio && 'root' in bio && (
              <div className="lawyer-bio-content mt-8.75">
                <RichText data={bio} enableGutter={false} enableProse={false} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
