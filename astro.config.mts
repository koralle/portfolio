// @ts-check
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import { defineConfig, passthroughImageService } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [mdx(), preact()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false
    }
  },
  image: {
    service: passthroughImageService()
  }
});
