import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { HomeTestimonialSectionBlock } from './Component'
import { createMockMedia } from '@/utilities/createMockMedia'

const meta: Meta<typeof HomeTestimonialSectionBlock> = {
  title: 'Blocks/HomeTestimonialSection',
  component: HomeTestimonialSectionBlock,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof HomeTestimonialSectionBlock>

const mockTestimonial = (name: string, title: string, text: string) => ({
  id: Math.random().toString(36).slice(2, 10),
  name,
  title,
  rating: 5,
  testimonial: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [
            {
              type: 'text',
              version: 1,
              text,
            },
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  },
  avatar: createMockMedia({ filename: 'avatar-placeholder.webp' }).image,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

export const Default: Story = {
  args: {
    blockType: 'homeTestimonialSection',
    sectionHeader: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'supportive-text',
                version: 1,
                children: [{ type: 'text', version: 1, text: 'TESTIMONIALS' }],
              },
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
          },
          {
            type: 'heading',
            version: 1,
            tag: 'h2',
            children: [{ type: 'text', version: 1, text: 'Real Results.\nReal People.' }],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    },
    testimonials: [
      mockTestimonial(
        'Cindy',
        'WCU Client',
        'I called many attorneys and they all said I had no chance of winning my Social Security Case. Richard was the only one that believed that I had a chronic illness and had a good case. I won my Social Security Case. Richard talks to me like a friend. He is understanding and a straight shooter. I would totally recommend him.',
      ),
      mockTestimonial(
        'John',
        'WCU Client',
        'Richard and his team were amazing throughout the entire process. They kept me informed every step of the way and fought hard for my case.',
      ),
      mockTestimonial(
        'Maria',
        'WCU Client',
        'I was injured at work and didn\'t know where to turn. Richard\'s team helped me get the compensation I deserved. Highly recommend!',
      ),
    ],
    link: {
      type: 'custom',
      url: '#',
      label: 'View All Google Reviews',
      appearance: 'gradient',
      showArrow: true,
    },
    videos: [
      {
        id: '1',
        video: createMockMedia({ filename: 'testimonial-video-1.mp4' }).image,
        thumbnail: createMockMedia({ filename: 'video-thumb-1.webp' }).image,
        caption: 'What made you realize you were with the right people?',
      },
      {
        id: '2',
        video: createMockMedia({ filename: 'testimonial-video-2.mp4' }).image,
        thumbnail: createMockMedia({ filename: 'video-thumb-2.webp' }).image,
        caption: 'How did our team help you cope with the challenges of your Workers\' Comp case?',
      },
    ],
  },
}
