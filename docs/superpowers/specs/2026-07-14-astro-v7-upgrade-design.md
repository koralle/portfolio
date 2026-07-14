# Astro v7 Upgrade Design

## Objective

Upgrade this static Astro portfolio from `astro@5.9.1` to `astro@7.0.7` through Astro v6, migrate its package manager configuration to pnpm v11, and target Node.js v24 or newer. Preserve the current static-output configuration and site behavior.

## Current State

- The manifest declares both legacy `packageManager: pnpm@10.11.0` and `devEngines.packageManager: >=10`, which conflict under pnpm v11.
- pnpm v11's current release is `11.12.0`; it requires Node `>=22.13`.
- Runtime: Node `v26.4.0`, satisfying the project target of Node `>=24.0.0` and Astro v6 and v7's Node `>=22.12.0` requirement.
- `astro.config.mts` uses `output: 'static'` and `passthroughImageService()`.
- The project has no `src/fetch.ts`, content collections, Vite configuration, or usages of the v6/v7 APIs identified as removed or deprecated.
- Existing dependencies include `@astrojs/cloudflare@12.5.4` and `wrangler@^4.15.2`.

## Scope

### Included

- Resolve and use the declared pnpm v11 toolchain.
- Replace the legacy package manager configuration with pnpm v11's `devEngines.packageManager` configuration.
- Preserve pnpm's resolved `packageManagerDependencies` in `pnpm-lock.yaml`.
- Add a pnpm v11 build-script allowlist for `esbuild`, `lefthook`, `sharp`, and `workerd`.
- Update the development runtime range to Node `>=24.0.0` and `@types/node` to `^26.1.1`.
- Align existing source formatting with the pnpm v11-resolved Prettier output.
- Fix the existing ESLint configuration so typed rules exclude Astro virtual TypeScript files and the CSS plugin has a local ESLint plugin type bridge.
- Use `@astrojs/check` for Astro application type checks and remove four redundant ESLint configuration type assertions.
- Upgrade Astro v5 to v6, validate the v6 migration, then upgrade to Astro v7.
- Upgrade the official Cloudflare package at each corresponding Astro major version.
- Update Wrangler to satisfy the Astro v7 Cloudflare adapter peer dependency (`^4.83.0`).
- Update Lucide, Cloudflare Workers types, and PostCSS to resolve Astro v7 peer dependencies; migrate Cloudflare type configuration to Wrangler-generated types; correct the invalid deleted-text CSS selector.
- Preserve the minimum-release-age exclusions for the approved latest Workers Types and PostCSS releases.
- Remove unused `@eslint/json`; scope the vulnerable Picomatch remediation to the Panda node dependency edge; and override vulnerable PostCSS and esbuild transitive dependencies with their reviewed patched versions.
- Change application configuration or templates only when a documented migration requirement or validation failure requires it.
- Run formatting, linting, type checks, production builds, and browser checks for `/` and `/404`.

### Excluded

- Changes to rendering mode, Cloudflare adapter configuration, deployment architecture, or image service behavior.
- Unrelated dependency upgrades, refactors, and UI redesigns.

## Upgrade Flow

1. Configure `devEngines.packageManager` as pnpm `>=11.0.0 <12.0.0` with `onFail: download`, and configure `devEngines.runtime` as Node `>=24.0.0`. Remove the conflicting legacy `packageManager` field and redundant `devDependencies.pnpm` entry.
2. Add `pnpm-workspace.yaml` with `allowBuilds: true` for exactly `esbuild`, `lefthook`, `sharp`, and `workerd`.
3. Update `@types/node` to `^26.1.1`.
4. Run pnpm install to resolve and lock `pnpm@11.12.0` under `packageManagerDependencies`, then rebuild the four approved dependencies. If the v11 invocation cannot complete, stop before modifying Astro dependencies and report the toolchain failure.
5. Apply the current formatter output to the existing affected Astro files and documentation, then fix the existing ESLint configuration failures. Regenerate no additional dependency ranges beyond pnpm's resolved lockfile graph.
6. Upgrade `astro` to the current v6 release and align the official Cloudflare dependency to its Astro v6-compatible major version. Regenerate `pnpm-lock.yaml`.
7. Run the validation suite. Fix only v6 migration failures, then rerun the complete suite.
8. Upgrade to `astro@7.0.7`, `@astrojs/cloudflare@14.1.2`, and `wrangler@^4.83.0`. Regenerate `pnpm-lock.yaml`.
9. Resolve v7 peer requirements by updating Lucide, Cloudflare Workers types, and PostCSS; generate `worker-configuration.d.ts`; use that file and Node types in `tsconfig.app.json`; correct the invalid `:where(:del)` selector.
10. Run the validation suite and `pnpm peers check`. Fix only documented v7 migration failures, then rerun the complete suite.
11. Keep `astro.config.mts` unchanged unless validation demonstrates a required migration change.

## Compatibility Checks

### Astro v6

- Confirm the development runtime is Node v24 or newer and Astro's Node requirement remains satisfied.
- Check Vite 7 and the v6 Cloudflare adapter upgrade for build or type errors.
- Confirm no removed legacy content-collection API or v6-removed transition API is introduced by generated output or project code.

### Astro v7

- Confirm Vite 8 resolves and builds successfully.
- Treat Rust compiler errors for unclosed tags as blocking and correct only the reported markup.
- Inspect rendered inline text for whitespace changes caused by the `compressHTML: 'jsx'` default.
- Confirm the project continues not to reserve `src/fetch.ts` for unrelated code.
- Confirm `pnpm peers check` has no unmet peer dependencies and the build has no invalid-selector warning.

## Validation

For both migration stages, execute these commands in order under the declared pnpm v11 toolchain:

```sh
pnpm format
pnpm lint
pnpm typecheck
pnpm build
```

After the final v7 build, run the development server and inspect `/` and `/404` in a browser. Verify layout, text spacing, and images.

## Tooling Baseline Repairs

The package manager re-resolved direct dependencies declared with caret ranges. Prettier 3.9.5 reports format differences in `src/components/Loader.astro` and `src/layouts/Layout.astro`; the accepted resolution is to apply that formatter output. The existing ESLint config applies type-aware rules to Astro virtual TypeScript files whose parser project is deliberately null, and requires a local type bridge for `@eslint/css`. The configuration fixes are limited to excluding `**/*.astro/*.ts` from the typed app config, correcting the malformed comma-separated glob entry, removing redundant parser and TypeScript plugin assertions, and casting the CSS plugin at its registration boundary. The application typecheck uses `astro check` with `@astrojs/check` because terminal `tsc` ignores `.astro` modules; the Node configuration continues to use `tsc`.

## Runtime Type Risk

The Node runtime range permits v24, while `@types/node@^26.1.1` can expose APIs that are unavailable in Node v24. Type checking alone cannot prove compatibility with the minimum runtime. The browser and build checks must be run using Node v24 as well as the local current Node version when Node-specific code is introduced.

## Build Script Approval Policy

pnpm v11 blocks unapproved dependency lifecycle scripts. `pnpm-workspace.yaml` permits builds only for `esbuild`, `lefthook`, `sharp`, and `workerd`, all of which are present in the resolved project graph and required by existing tooling. Any newly introduced build script remains blocked until its package and lifecycle script are reviewed and added explicitly.

## Approved Dependency Exceptions

Panda CSS's vulnerable Picomatch path is limited to `@pandacss/node`; the workspace scopes the `@pandacss/node>picomatch` override to `picomatch@4.0.5` so `micromatch` retains its compatible v2 range. `postcss@8.5.19` and `esbuild@0.28.1` are approved global overrides because remediating all audited paths requires them; they affect every matching dependency edge. pnpm's one-day minimum release age is explicitly bypassed for `@cloudflare/workers-types@5.20260713.1` and `postcss@8.5.19`; these exact releases were reviewed and approved to retain current compatible dependencies. The unused `@eslint/json` direct development dependency is removed to eliminate its vulnerable `@eslint/plugin-kit` path. All overrides require Panda code-generation, full quality checks, peer validation, and a clean `pnpm audit` result before acceptance. Future upgrades of overridden packages require a new review.

## Failure Handling

- Stop at the stage that fails; do not begin the next major update.
- Classify failures as package resolution, formatting/linting, type checking, build, or browser rendering.
- Apply the smallest fix supported by the corresponding Astro migration guide.
- Re-run the entire stage validation suite after every fix.

## Sources

- https://docs.astro.build/en/guides/upgrade-to/v6/
- https://docs.astro.build/en/guides/upgrade-to/v7/
- https://registry.npmjs.org/astro/latest
- https://registry.npmjs.org/@astrojs%2Fcloudflare/latest
- https://pnpm.io/package_json
- https://registry.npmjs.org/pnpm/latest
- https://github.com/nodejs/Release/blob/main/schedule.json
- https://registry.npmjs.org/@types%2Fnode/latest
- https://pnpm.io/settings#allowbuilds
