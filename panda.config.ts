import { defineConfig, defineGlobalStyles } from '@pandacss/dev';

const globalStyles = defineGlobalStyles({
  ':root, body': {
    color: '{colors.text}',
    backgroundColor: '{colors.bg.base}'
  },
  ':focus-visible': {
    outline: '2px solid {colors.focus}',
    outlineOffset: '2px'
  }
});

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx,astro}'],
  exclude: [],
  theme: {
    tokens: {},
    semanticTokens: {
      colors: {
        bg: {
          base: { value: '#1a1a1a' },
          raised: { value: '#212121' }
        },
        text: {
          DEFAULT: { value: '#e0e0e0' },
          muted: { value: '#c4c8d0' }
        },
        primary: { value: '#ec93a1' },
        focus: { value: '#ec93a1' }
      },
      sizes: {
        content: { value: '960px' },
        wide: { value: '1440px' }
      }
    },
    extend: {
      breakpoints: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      }
    }
  },
  globalCss: globalStyles,
  outdir: 'styled-system'
});
