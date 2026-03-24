import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { HomeAboutUsBlock } from './Component'
import { createMockMedia } from '@/utilities/createMockMedia'

const meta: Meta<typeof HomeAboutUsBlock> = {
  title: 'Blocks/HomeAboutUs',
  component: HomeAboutUsBlock,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof HomeAboutUsBlock>

export const Default: Story = {
  args: {
    blockType: 'homeAboutUs',
    sectionHeader: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'ABOUT US', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: '30 Years. One Mission.', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    bodyText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Workers Compensation Utah has represented injured Utah workers for over 30 years. We handle workers\u2019 compensation claims, permanent wage loss cases, construction accidents, slip and fall injuries, and wrongful death \u2014 exclusively for injured workers, never insurance companies.',
                format: 0,
                detail: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Our cases have been tried and won at every level of the Utah courts, including the Utah Court of Appeals and the Utah Supreme Court. Attorney Richard Burke is the only plaintiff\u2019s workers\u2019 compensation attorney in Utah selected as a member of the College of Workers\u2019 Compensation Lawyers \u2014 the most prestigious organization of its kind in the country.',
                format: 0,
                detail: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    image: createMockMedia({ filename: 'utah-capitol.webp' }).image,
    link: {
      type: 'reference',
      label: 'More About Us',
      appearance: 'gradient',
      showArrow: true,
    },
  },
}
