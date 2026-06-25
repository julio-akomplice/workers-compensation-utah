import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { TestimonialsSection } from '../../blocks/TestimonialsSection/config'
import { FAQSection } from '../../blocks/FAQSection/config'
import { ContactSectionBlock } from '../../blocks/ContactSectionBlock/config'
import { CaseQuestionnaireCTABlock } from '../../blocks/CaseQuestionnaireCTABlock/config'
import { LandingPageResultsSection } from '../../blocks/LandingPageResultsSection/config'
import { LandingPageSettlementsSection } from '../../blocks/LandingPageSettlementsSection/config'
import { LandingPageWhyUsSection } from '../../blocks/LandingPageWhyUsSectionBlock/config'
import { LandingPageAboutAttorneySection } from '../../blocks/LandingPageAboutAttorneySectionBlock/config'
import { LandingPageHero01 } from '../../blocks/LandingPageHero01/config'
import { LandingPageTestimonialsSection } from '../../blocks/LandingPageTestimonialsSectionBlock/config'
import { LandingPageCallToActionSection } from '../../blocks/LandingPageCallToActionSectionBlock/config'
import { LandingPageFooter } from '../../blocks/LandingPageFooterBlock/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateLandingPage, revalidateLandingPageDelete } from './hooks/revalidateLandingPage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { schemaMarkup } from '../../fields/schemaMarkup'

export const LandingPages: CollectionConfig<'landing-pages'> = {
  slug: 'landing-pages',
  trash: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'landing-pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'landing-pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                LandingPageHero01,
                CallToAction,
                Content,
                MediaBlock,
                FormBlock,
                TestimonialsSection,
                FAQSection,
                ContactSectionBlock,
                CaseQuestionnaireCTABlock,
                LandingPageResultsSection,
                LandingPageSettlementsSection,
                LandingPageWhyUsSection,
                LandingPageAboutAttorneySection,
                LandingPageTestimonialsSection,
                LandingPageCallToActionSection,
                LandingPageFooter,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'solidMenu',
              type: 'checkbox',
              label: 'Solid Menu',
              defaultValue: false,
              admin: {
                description:
                  'Enable this when the page has no hero image. The navigation bar will have a solid dark background instead of being transparent.',
              },
            },
          ],
          label: 'Settings',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
            schemaMarkup,
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateLandingPage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateLandingPageDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
