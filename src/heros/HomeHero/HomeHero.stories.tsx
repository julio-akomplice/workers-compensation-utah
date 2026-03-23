import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { HomeHero } from './index'
import companyNameImage from './image-wcu-hero-company-name.webp'

const meta: Meta<typeof HomeHero> = {
  title: 'Components/Heros/Home',
  component: HomeHero,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof HomeHero>

export const Default: Story = {
  args: {
    type: 'homeHero',
    supportiveText: 'Serving Utah for 30 Years',
    media: {
      id: '1',
      alt: 'Workers Compensation Utah',
      url: 'http://localhost:3000/api/media/file/image-hero1-300x169.webp',
      width: 3200,
      height: 1800,
      filename: 'image-wcu-hero-company-name.webp',
      mimeType: 'image/webp',
      filesize: 0,
      focalX: 50,
      focalY: 50,
      createdAt: '2026-03-20T17:40:42.629Z',
      updatedAt: '',
    },
    links: [
      {
        link: {
          type: 'custom',
          url: '#',
          label: 'Free Case Evaluation',
          appearance: 'gradient',
        },
      },
    ],
  },
}
