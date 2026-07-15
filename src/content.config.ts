import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { locales } from './i18n/config';

const home = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/home' }),
  schema: z.object({
    locale: z.enum(locales),
    section: z.enum(['about', 'skills', 'projects', 'contact']),
    title: z.string(),
    order: z.number().int().nonnegative(),
    tone: z.enum(['dark', 'darker']).default('dark'),
  }),
});

export const collections = { home };
