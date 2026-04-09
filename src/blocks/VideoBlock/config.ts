import type { Block } from 'payload'

export const VideoBlock: Block = {
  slug: 'videoBlock',
  interfaceName: 'VideoBlock',
  labels: {
    singular: 'Video',
    plural: 'Video Blocks',
  },
  fields: [
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: { contains: 'video' },
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: 'Poster Image',
      admin: {
        description: 'Thumbnail image shown before the video plays.',
      },
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay',
      defaultValue: false,
    },
    {
      name: 'muted',
      type: 'checkbox',
      label: 'Muted',
      defaultValue: true,
    },
    {
      name: 'loop',
      type: 'checkbox',
      label: 'Loop',
      defaultValue: false,
    },
    {
      name: 'controls',
      type: 'checkbox',
      label: 'Show Controls',
      defaultValue: true,
    },
    {
      name: 'playsInline',
      type: 'checkbox',
      label: 'Plays Inline',
      defaultValue: true,
    },
  ],
}
