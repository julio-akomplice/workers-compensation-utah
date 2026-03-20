import type { Preview } from '@storybook/nextjs'

import '../src/app/(frontend)/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      image: {
        unoptimized: true,
      },
    },
  },
}

export default preview
