import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { HomeHero } from './index'

const meta: Meta<typeof HomeHero> = {
  title: 'Components/Heros/Home',
  component: HomeHero,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof HomeHero>

export const Default: Story = {}
