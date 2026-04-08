import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AwardsBlock } from '@/blocks/Awards/Component'
import { CompleteContentBlock } from '@/blocks/CompleteContent/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PracticeAreasSectionBlock } from '@/blocks/PracticeAreasSection/Component'
import { HomeAboutUsBlock } from '@/blocks/HomeAboutUs/Component'
import { HomeTestimonialSectionBlock } from '@/blocks/HomeTestimonialSection/Component'
import { HomeCaseStudiesSectionBlock } from '@/blocks/HomeCaseStudiesSection/Component'
import { CaseQuestionnaireCTABlockComponent } from '@/blocks/CaseQuestionnaireCTABlock/Component'
import { ContactSectionBlockComponent } from '@/blocks/ContactSectionBlock/Component'
import { BreadcrumbBlock } from '@/blocks/Breadcrumb/Component'
import { AboutAboutFirmBlock } from '@/blocks/AboutAboutFirm/Component'
import { AboutWhyChooseUsBlock } from '@/blocks/AboutWhyChooseUs/Component'
import { AboutOurAttorneyBlock } from '@/blocks/AboutOurAttorney/Component'
import { AboutGetStartedBlock } from '@/blocks/AboutGetStarted/Component'
import { TestimonialsSectionBlock } from '@/blocks/TestimonialsSection/Component'
import { FAQSectionBlockComponent } from '@/blocks/FAQSection/Component'
import { ArticlesSectionBlock } from '@/blocks/ArticlesSection/Component'
import { LawyerBioBlock } from '@/blocks/LawyerBioBlock/Component'
import { ContactPageBlockComponent } from '@/blocks/ContactPageBlock/Component'
import { LegalPageBlockComponent } from '@/blocks/LegalPageBlock/Component'
import { PracticeAreaPageBlockComponent } from '@/blocks/PracticeAreaPageBlock/Component'
import { CaseQuestionnaireBlockComponent } from '@/blocks/CaseQuestionnaireBlock/Component'
import { ResourcesPageBlockComponent } from '@/blocks/ResourcesPageBlock/Component'
import { AreasServedPageBlockComponent } from '@/blocks/AreasServedPageBlock/Component'
import { FAQPageBlockComponent } from '@/blocks/FAQPageBlock/Component'
import { BlogPageBlockComponent } from '@/blocks/BlogPageBlock/Component'
import { CaseStudyPageBlockComponent } from '@/blocks/CaseStudyPageBlock/Component'
import { AwardsSectionBlockComponent } from '@/blocks/AwardsSectionBlock/Component'

const blockComponents = {
  awards: AwardsBlock,
  archive: ArchiveBlock,
  completeContentBlock: CompleteContentBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  homeAboutUs: HomeAboutUsBlock,
  homeCaseStudiesSection: HomeCaseStudiesSectionBlock,
  homeTestimonialSection: HomeTestimonialSectionBlock,
  mediaBlock: MediaBlock,
  practiceAreasSection: PracticeAreasSectionBlock,
  caseQuestionnaireCTA: CaseQuestionnaireCTABlockComponent,
  contactSection: ContactSectionBlockComponent,
  breadcrumb: BreadcrumbBlock,
  aboutAboutFirm: AboutAboutFirmBlock,
  aboutWhyChooseUs: AboutWhyChooseUsBlock,
  aboutOurAttorney: AboutOurAttorneyBlock,
  aboutGetStarted: AboutGetStartedBlock,
  testimonialsSection: TestimonialsSectionBlock,
  faqSection: FAQSectionBlockComponent,
  articlesSection: ArticlesSectionBlock,
  lawyerBioBlock: LawyerBioBlock,
  contactPage: ContactPageBlockComponent,
  legalPage: LegalPageBlockComponent,
  practiceAreaPage: PracticeAreaPageBlockComponent,
  caseQuestionnaire: CaseQuestionnaireBlockComponent,
  resourcesPage: ResourcesPageBlockComponent,
  areasServedPage: AreasServedPageBlockComponent,
  faqPage: FAQPageBlockComponent,
  blogPage: BlogPageBlockComponent,
  caseStudyPage: CaseStudyPageBlockComponent,
  awardsSection: AwardsSectionBlockComponent,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
