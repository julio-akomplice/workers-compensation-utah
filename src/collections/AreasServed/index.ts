import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { Awards } from '../../blocks/Awards/config'
import { CompleteContent } from '../../blocks/CompleteContent/config'
import { PracticeAreasSection } from '../../blocks/PracticeAreasSection/config'
import { PracticeAreaContentBlock } from '../../blocks/PracticeAreaContentBlock/config'
import { FAQContentBlock } from '../../blocks/FAQContentBlock/config'
import { CaseQuestionnaireCTABlock } from '../../blocks/CaseQuestionnaireCTABlock/config'
import { FAQSection } from '../../blocks/FAQSection/config'
import { ArticlesSection } from '../../blocks/ArticlesSection/config'
import { ContactSectionBlock } from '../../blocks/ContactSectionBlock/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidateAreaServed } from './hooks/revalidateAreaServed'
import { validateUniqueSlugPerParent } from '../../hooks/validateUniqueSlugPerParent'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { schemaMarkup } from '../../fields/schemaMarkup'

export const AreasServed: CollectionConfig<'areas-served'> = {
  slug: 'areas-served',
  trash: true,
  labels: {
    singular: 'Area Served',
    plural: 'Areas Served',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    breadcrumbs: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const breadcrumbs = data?.breadcrumbs
        const breadcrumbUrl =
          Array.isArray(breadcrumbs) && breadcrumbs.length > 0
            ? (breadcrumbs[breadcrumbs.length - 1]?.url as string | undefined)
            : undefined
        return generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'areas-served',
          req,
          breadcrumbUrl,
        })
      },
    },
    preview: (data, { req }) => {
      const breadcrumbs = data?.breadcrumbs
      const breadcrumbUrl =
        Array.isArray(breadcrumbs) && breadcrumbs.length > 0
          ? (breadcrumbs[breadcrumbs.length - 1]?.url as string | undefined)
          : undefined
      return generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'areas-served',
        req,
        breadcrumbUrl,
      })
    },
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
              name: 'general',
              type: 'group',
              label: 'General',
              fields: [
                {
                  name: 'alternativeTitle',
                  type: 'textarea',
                  label: 'Alternative Title',
                },
{
                  name: 'shortDescription',
                  type: 'textarea',
                  label: 'Short Description',
                  required: true,
                },
              ],
            },
            {
              name: 'contentSection',
              type: 'group',
              label: 'Content',
              fields: PracticeAreaContentBlock.fields,
            },
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                Awards,
                CompleteContent,
                PracticeAreasSection,
                PracticeAreaContentBlock,
                FAQContentBlock,
                CaseQuestionnaireCTABlock,
                FAQSection,
                ArticlesSection,
                ContactSectionBlock,
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
          label: 'Related Pages',
          fields: [
            {
              name: 'relatedPages',
              type: 'relationship',
              relationTo: ['areas-served', 'practice-areas'],
              hasMany: true,
              label: 'Related Pages',
              admin: {
                description:
                  'Select areas served or practice areas to display as related page links in the sidebar.',
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
    slugField({ disableUnique: true }),
  ],
  hooks: {
    afterChange: [revalidateAreaServed],
    beforeChange: [populatePublishedAt, validateUniqueSlugPerParent({ collection: 'areas-served' })],
    afterDelete: [revalidateDelete],
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
