import eslintPluginAstro from 'eslint-plugin-astro';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    name: '@koralle-portfolio/ignores',
    ignores: [
      '**/.astro/*',
      '**/styled-system/*',
      '**/dist/*',
      'postcss.config.cjs',
      'worker-configuration.d.ts'
    ]
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked
    ],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    }
  },
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-strict'],
  {
    files: ['**/*.astro/*.ts'],
    ...tseslint.configs.disableTypeChecked
  },
  {
    files: ['src/**/*.astro'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    }
  },
  eslintConfigPrettier
]);
