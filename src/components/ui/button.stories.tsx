import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from './button'
import { ArrowRight } from './icons/ArrowRight'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Gradient: Story = {
  render: (args) => <Button {...args}>Take Questionnaire</Button>,
}
