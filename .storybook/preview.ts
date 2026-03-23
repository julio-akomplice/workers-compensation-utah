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
    viewport: {
      options: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '390px',
            height: '700px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1024px',
            height: '768px',
          },
        },
        desktopSm: {
          name: 'Small Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
        desktopXl: {
          name: 'XL Desktop',
          styles: {
            width: '1536px',
            height: '864px',
          },
        },
        desktop2xl: {
          name: '2XL Desktop',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
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
