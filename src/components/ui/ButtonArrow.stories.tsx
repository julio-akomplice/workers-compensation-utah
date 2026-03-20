import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ButtonArrow } from './ButtonArrow'

const meta: Meta<typeof ButtonArrow> = {
  title: 'Components/ButtonArrow',
  component: ButtonArrow,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ButtonArrow>

export const Default: Story = {
  args: {
    children: 'Take Questionnaire',
  },
}
