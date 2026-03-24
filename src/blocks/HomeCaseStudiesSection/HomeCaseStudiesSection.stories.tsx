import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { HomeCaseStudiesSectionBlock } from './Component'

const meta: Meta<typeof HomeCaseStudiesSectionBlock> = {
  title: 'Blocks/HomeCaseStudiesSection',
  component: HomeCaseStudiesSectionBlock,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof HomeCaseStudiesSectionBlock>

export const Default: Story = {
  args: {
    blockType: 'homeCaseStudiesSection',
    sectionHeader: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            version: 1,
            tag: 'h2',
            children: [
              {
                type: 'text',
                version: 1,
                text: 'Millions. And Millions. And Millions.\nRecovered for Utah Workers.',
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
    populateBy: 'selection',
    selectedCaseStudies: [
      {
        id: '1',
        category: 'Workers Compensation Settlement',
        settlementAmount: '$2,000,000',
        description: 'Wage loss and medical care following a chemical explosion.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        category: 'Personal Injury Settlement',
        settlementAmount: '$1,200,000',
        description: 'Personal injury claim after an accident.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        category: 'Workers Compensation Settlement',
        settlementAmount: '$400,000',
        description: 'Wage loss from a slip and fall accident.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        category: 'Workers Compensation Settlement',
        settlementAmount: '$390,000',
        description: 'Wage loss after falling from a ladder.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    link: {
      type: 'custom',
      url: '#',
      label: 'View More Case Studies',
      appearance: 'gradient',
      showArrow: true,
    },
  },
}
