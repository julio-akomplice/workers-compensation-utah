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
    image: createMockMedia({ filename: 'utah-capitol.webp' }).image,
    link: {
      type: 'reference',
      label: 'More About Us',
      appearance: 'gradient',
      showArrow: true,
    },
  },
}
