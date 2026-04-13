import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (data?.mimeType?.includes('svg') && req.file) {
          data.svgContent = req.file.data.toString('utf-8')
        }
        return data
      },
    ],
    afterRead: [
      async ({ doc }) => {
        if (doc.mimeType?.includes('svg') && !doc.svgContent && doc.url) {
          // Only fetch if URL is absolute (e.g. S3). Skip relative/local paths
          // since files may no longer exist locally after migrating to S3.
          if (!doc.url.startsWith('http')) return doc
          try {
            const res = await fetch(doc.url, { signal: AbortSignal.timeout(5000) })
            if (res.ok) {
              doc.svgContent = await res.text()
            }
          } catch {
            // Failed to fetch SVG — don't block rendering
          }
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'svgContent',
      type: 'textarea',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    crop: false,
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
