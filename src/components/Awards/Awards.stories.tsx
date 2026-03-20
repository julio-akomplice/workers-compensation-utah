import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Awards } from './index'

const meta: Meta<typeof Awards> = {
  title: 'Components/Awards',
  component: Awards,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Awards>

export const Default: Story = {}
