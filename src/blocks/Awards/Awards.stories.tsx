import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { AwardsBlock } from './Component'
import { createMockMedia } from '@/utilities/createMockMedia'

const meta: Meta<typeof AwardsBlock> = {
  title: 'Blocks/Awards',
  component: AwardsBlock,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof AwardsBlock>

export const Default: Story = {
  args: {
    headline: 'Our Awards',
    blockType: 'awards',
    gallery: [
      createMockMedia({ filename: 'Img_Super%20Lawyers%20Logo-1.webp' }),
      createMockMedia({ filename: 'Img_Super%20Lawyers%20Logo-1.webp' }),
      createMockMedia({ filename: 'Img_Super%20Lawyers%20Logo-1.webp' }),
      createMockMedia({ filename: 'Img_Super%20Lawyers%20Logo-1.webp' }),
    ],
  },
}
