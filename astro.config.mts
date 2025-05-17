// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  vite: {
    // @ts-ignore
    plugins: [tailwindcss(), visualizer({ emitFile: true, fileName: 'stats.html' }), react()],
  },
});
