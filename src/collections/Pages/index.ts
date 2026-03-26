import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { Awards } from '../../blocks/Awards/config'
import { CompleteContent } from '../../blocks/CompleteContent/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { PracticeAreasSection } from '../../blocks/PracticeAreasSection/config'
import { HomeAboutUs } from '../../blocks/HomeAboutUs/config'
import { HomeTestimonialSection } from '../../blocks/HomeTestimonialSection/config'
import { HomeCaseStudiesSection } from '../../blocks/HomeCaseStudiesSection/config'
import { CaseQuestionnaireCTABlock } from '../../blocks/CaseQuestionnaireCTABlock/config'
import { ContactSectionBlock } from '../../blocks/ContactSectionBlock/config'
import { Breadcrumb } from '../../blocks/Breadcrumb/config'
import { AboutAboutFirm } from '../../blocks/AboutAboutFirm/config'
import { AboutWhyChooseUs } from '../../blocks/AboutWhyChooseUs/config'
import { AboutOurAttorney } from '../../blocks/AboutOurAttorney/config'
import { AboutGetStarted } from '../../blocks/AboutGetStarted/config'
import { TestimonialsSection } from '../../blocks/TestimonialsSection/config'
import { FAQSection } from '../../blocks/FAQSection/config'
import { ArticlesSection } from '../../blocks/ArticlesSection/config'
import { LawyerBioBlock } from '../../blocks/LawyerBioBlock/config'
import { ContactPageBlock } from '../../blocks/ContactPageBlock/config'
import { LegalPageBlock } from '../../blocks/LegalPageBlock/config'
import { PracticeAreaPageBlock } from '../../blocks/PracticeAreaPageBlock/config'
import { CaseQuestionnaireBlock } from '../../blocks/CaseQuestionnaireBlock/config'
import { ResourcesPageBlock } from '../../blocks/ResourcesPageBlock/config'
import { AreasServedPageBlock } from '../../blocks/AreasServedPageBlock/config'
import { FAQPageBlock } from '../../blocks/FAQPageBlock/config'
import { BlogPageBlock } from '../../blocks/BlogPageBlock/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
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
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
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
              blocks: [Breadcrumb, CallToAction, Content, MediaBlock, Archive, FormBlock, Awards, CompleteContent, PracticeAreasSection, HomeTestimonialSection, HomeAboutUs, HomeCaseStudiesSection, CaseQuestionnaireCTABlock, ContactSectionBlock, ContactPageBlock, AboutAboutFirm, AboutWhyChooseUs, AboutOurAttorney, AboutGetStarted, TestimonialsSection, FAQSection, ArticlesSection, LawyerBioBlock, LegalPageBlock, PracticeAreaPageBlock, CaseQuestionnaireBlock, ResourcesPageBlock, AreasServedPageBlock, FAQPageBlock, BlogPageBlock],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          label: 'Settings',
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
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
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
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
