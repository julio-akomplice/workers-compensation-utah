import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [],
  framework: '@storybook/nextjs',
  staticDirs: ['../public'],
  webpackFinal: (config) => {
    // Add SVGR loader to match Next.js config
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // Remove any existing SVG rules
    config.module.rules = config.module.rules.map((rule) => {
      if (
        rule &&
        typeof rule === 'object' &&
        rule.test instanceof RegExp &&
        rule.test.test('.svg')
      ) {
        return { ...rule, exclude: /\.svg$/ };
      }
      return rule;
    });

    // Add @svgr/webpack for SVGs (same as next.config.js)
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
export default config;
