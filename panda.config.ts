import { defineConfig, defineGlobalStyles } from '@pandacss/dev';

const globalStyles = defineGlobalStyles({
  ':root, body': {
    color: '#e0e0e0',
  },
});

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx,astro}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    tokens: {},
    semanticTokens: {
      colors: {
        primary: {
          value: '#ec93a1',
        },
      },
    },
    extend: {},
  },

  globalCss: globalStyles,
  // The output directory for your css system
  outdir: 'styled-system',
});
