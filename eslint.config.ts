// @ts-check
import typegen from 'eslint-typegen';
import js from '@eslint/js';
import { ConfigArray } from 'typescript-eslint';
import css from '@eslint/css';
import tseslint from 'typescript-eslint';
import { ESLint, Linter } from 'eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginJson from '@eslint/json';

const strictTypeCheckedRules = tseslint.configs.strictTypeChecked
  .map(config => config.rules)
  .filter(item => item !== undefined)
  .reduce((acc, item) => ({ ...acc, ...item }), {});

const stylisticTypeCheckedRules = tseslint.configs.stylisticTypeChecked
  .map(config => config.rules)
  .filter(item => item !== undefined)
  .reduce((acc, item) => ({ ...acc, ...item }), {});

const config: ConfigArray = await typegen([
  {
    name: '@koralle-portfolio/ignores',
    ignores: [
      '**/.astro/*',
      '**/styled-system/*',
      '**/dist/*',
      'eslint-typegen.d.ts',
      'postcss.config.cjs',
    ],
  },
  {
    name: '@koralle-portfolio/js',
    files: [
      'src/**/*.ts',
      'src/**/*.astro, .prettierrc.mjs, panda.config.ts, eslint.config.ts',
      'astro.config.mts',
      'postcss.config.cjs',
    ],
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  {
    name: '@koralle-portfolio/typescript (app)',
    files: ['src/**/*.ts', 'src/**/*.astro', 'astro.config.mts'],
    languageOptions: {
      parser: tseslint.parser as Linter.Parser,
      parserOptions: {
        project: './tsconfig.app.json',
        sourceType: 'module',
        ecmaVersion: 2024,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin as ESLint.Plugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...strictTypeCheckedRules,
      ...stylisticTypeCheckedRules,
    },
  },
  {
    name: '@koralle-portfolio/typescript (node)',
    files: ['.prettierrc.mjs', 'panda.config.ts', 'eslint.config.ts', 'postcss.config.cjs'],
    languageOptions: {
      parser: tseslint.parser as Linter.Parser,
      parserOptions: {
        project: './tsconfig.node.json',
        sourceType: 'module',
        ecmaVersion: 2024,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin as ESLint.Plugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...strictTypeCheckedRules,
      ...stylisticTypeCheckedRules,
    },
  },
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-strict'],
  {
    name: '@koralle-portfolio/css',
    files: ['src/**/*.css'],
    ignores: ['src/styles/preflight.css'],
    language: 'css/css',
    plugins: { css },
    rules: {
      ...css.configs.recommended.rules,

      // astro/recommended
      'astro/missing-client-only-directive-value': 'off',
      'astro/no-conflict-set-directives': 'off',
      'astro/no-deprecated-astro-canonicalurl': 'off',
      'astro/no-deprecated-astro-fetchcontent': 'off',
      'astro/no-deprecated-astro-resolve': 'off',
      'astro/no-deprecated-getentrybyslug': 'off',
      'astro/no-unused-define-vars-in-style': 'off',
      'astro/valid-compile': 'off',

      // astro/jsx-a11y-strict
      'astro/jsx-a11y/alt-text': 'off',
      'astro/jsx-a11y/anchor-has-content': 'off',
      'astro/jsx-a11y/anchor-is-valid': 'off',
      'astro/jsx-a11y/aria-activedescendant-has-tabindex': 'off',
      'astro/jsx-a11y/aria-props': 'off',
      'astro/jsx-a11y/aria-proptypes': 'off',
      'astro/jsx-a11y/aria-role': 'off',
      'astro/jsx-a11y/aria-unsupported-elements': 'off',
      'astro/jsx-a11y/autocomplete-valid': 'off',
      'astro/jsx-a11y/click-events-have-key-events': 'off',
      'astro/jsx-a11y/control-has-associated-label': 'off',
      'astro/jsx-a11y/heading-has-content': 'off',
      'astro/jsx-a11y/html-has-lang': 'off',
      'astro/jsx-a11y/iframe-has-title': 'off',
      'astro/jsx-a11y/img-redundant-alt': 'off',
      'astro/jsx-a11y/interactive-supports-focus': 'off',
      'astro/jsx-a11y/label-has-for': 'off',
      'astro/jsx-a11y/label-has-associated-control': 'off',
      'astro/jsx-a11y/media-has-caption': 'off',
      'astro/jsx-a11y/mouse-events-have-key-events': 'off',
      'astro/jsx-a11y/no-access-key': 'off',
      'astro/jsx-a11y/no-autofocus': 'off',
      'astro/jsx-a11y/no-distracting-elements': 'off',
      'astro/jsx-a11y/no-interactive-element-to-noninteractive-role': 'off',
      'astro/jsx-a11y/no-noninteractive-element-interactions': 'off',
      'astro/jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
      'astro/jsx-a11y/no-noninteractive-tabindex': 'off',
      'astro/jsx-a11y/no-redundant-roles': 'off',
      'astro/jsx-a11y/no-static-element-interactions': 'off',
      'astro/jsx-a11y/role-has-required-aria-props': 'off',
      'astro/jsx-a11y/role-supports-aria-props': 'off',
      'astro/jsx-a11y/scope': 'off',
      'astro/jsx-a11y/tabindex-no-positive': 'off',
    },
  },
  {
    name: '@koralle-portfolio/json',
    files: ['package.json', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json'],
    language: 'json/json',
    plugins: { json: eslintPluginJson },
    rules: {
      ...eslintPluginJson.configs.recommended.rules,

      // astro/recommended
      'astro/missing-client-only-directive-value': 'off',
      'astro/no-conflict-set-directives': 'off',
      'astro/no-deprecated-astro-canonicalurl': 'off',
      'astro/no-deprecated-astro-fetchcontent': 'off',
      'astro/no-deprecated-astro-resolve': 'off',
      'astro/no-deprecated-getentrybyslug': 'off',
      'astro/no-unused-define-vars-in-style': 'off',
      'astro/valid-compile': 'off',

      // astro/jsx-a11y-strict
      'astro/jsx-a11y/alt-text': 'off',
      'astro/jsx-a11y/anchor-has-content': 'off',
      'astro/jsx-a11y/anchor-is-valid': 'off',
      'astro/jsx-a11y/aria-activedescendant-has-tabindex': 'off',
      'astro/jsx-a11y/aria-props': 'off',
      'astro/jsx-a11y/aria-proptypes': 'off',
      'astro/jsx-a11y/aria-role': 'off',
      'astro/jsx-a11y/aria-unsupported-elements': 'off',
      'astro/jsx-a11y/autocomplete-valid': 'off',
      'astro/jsx-a11y/click-events-have-key-events': 'off',
      'astro/jsx-a11y/control-has-associated-label': 'off',
      'astro/jsx-a11y/heading-has-content': 'off',
      'astro/jsx-a11y/html-has-lang': 'off',
      'astro/jsx-a11y/iframe-has-title': 'off',
      'astro/jsx-a11y/img-redundant-alt': 'off',
      'astro/jsx-a11y/interactive-supports-focus': 'off',
      'astro/jsx-a11y/label-has-for': 'off',
      'astro/jsx-a11y/label-has-associated-control': 'off',
      'astro/jsx-a11y/media-has-caption': 'off',
      'astro/jsx-a11y/mouse-events-have-key-events': 'off',
      'astro/jsx-a11y/no-access-key': 'off',
      'astro/jsx-a11y/no-autofocus': 'off',
      'astro/jsx-a11y/no-distracting-elements': 'off',
      'astro/jsx-a11y/no-interactive-element-to-noninteractive-role': 'off',
      'astro/jsx-a11y/no-noninteractive-element-interactions': 'off',
      'astro/jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
      'astro/jsx-a11y/no-noninteractive-tabindex': 'off',
      'astro/jsx-a11y/no-redundant-roles': 'off',
      'astro/jsx-a11y/no-static-element-interactions': 'off',
      'astro/jsx-a11y/role-has-required-aria-props': 'off',
      'astro/jsx-a11y/role-supports-aria-props': 'off',
      'astro/jsx-a11y/scope': 'off',
      'astro/jsx-a11y/tabindex-no-positive': 'off',
    },
  },
  {
    name: '@koralle-portfolio/jsonc',
    files: ['wrangler.jsonc'],
    language: 'json/jsonc',
    plugins: { json: eslintPluginJson },
    rules: {
      ...eslintPluginJson.configs.recommended.rules,

      // astro/recommended
      'astro/missing-client-only-directive-value': 'off',
      'astro/no-conflict-set-directives': 'off',
      'astro/no-deprecated-astro-canonicalurl': 'off',
      'astro/no-deprecated-astro-fetchcontent': 'off',
      'astro/no-deprecated-astro-resolve': 'off',
      'astro/no-deprecated-getentrybyslug': 'off',
      'astro/no-unused-define-vars-in-style': 'off',
      'astro/valid-compile': 'off',

      // astro/jsx-a11y-strict
      'astro/jsx-a11y/alt-text': 'off',
      'astro/jsx-a11y/anchor-has-content': 'off',
      'astro/jsx-a11y/anchor-is-valid': 'off',
      'astro/jsx-a11y/aria-activedescendant-has-tabindex': 'off',
      'astro/jsx-a11y/aria-props': 'off',
      'astro/jsx-a11y/aria-proptypes': 'off',
      'astro/jsx-a11y/aria-role': 'off',
      'astro/jsx-a11y/aria-unsupported-elements': 'off',
      'astro/jsx-a11y/autocomplete-valid': 'off',
      'astro/jsx-a11y/click-events-have-key-events': 'off',
      'astro/jsx-a11y/control-has-associated-label': 'off',
      'astro/jsx-a11y/heading-has-content': 'off',
      'astro/jsx-a11y/html-has-lang': 'off',
      'astro/jsx-a11y/iframe-has-title': 'off',
      'astro/jsx-a11y/img-redundant-alt': 'off',
      'astro/jsx-a11y/interactive-supports-focus': 'off',
      'astro/jsx-a11y/label-has-for': 'off',
      'astro/jsx-a11y/label-has-associated-control': 'off',
      'astro/jsx-a11y/media-has-caption': 'off',
      'astro/jsx-a11y/mouse-events-have-key-events': 'off',
      'astro/jsx-a11y/no-access-key': 'off',
      'astro/jsx-a11y/no-autofocus': 'off',
      'astro/jsx-a11y/no-distracting-elements': 'off',
      'astro/jsx-a11y/no-interactive-element-to-noninteractive-role': 'off',
      'astro/jsx-a11y/no-noninteractive-element-interactions': 'off',
      'astro/jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
      'astro/jsx-a11y/no-noninteractive-tabindex': 'off',
      'astro/jsx-a11y/no-redundant-roles': 'off',
      'astro/jsx-a11y/no-static-element-interactions': 'off',
      'astro/jsx-a11y/role-has-required-aria-props': 'off',
      'astro/jsx-a11y/role-supports-aria-props': 'off',
      'astro/jsx-a11y/scope': 'off',
      'astro/jsx-a11y/tabindex-no-positive': 'off',
    },
  },
  {
    name: '@koralle-portfolio/config-prettier',
    files: [
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
      'src/**/*.ts',
      '.prettierrc.mjs',
      'panda.config.ts',
      'eslint.config.ts',
    ],
    rules: {
      ...eslintConfigPrettier.rules,
    },
  },
]);

export default config;
