# Astro v7 and pnpm v11 Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the portfolio to pnpm v11, Node.js v24 or newer, Astro v7, and compatible Cloudflare tooling while preserving static-site behavior.

**Architecture:** Update package-manager and runtime policy in `package.json`, then perform Astro's v5-to-v6 and v6-to-v7 migrations as independently validated dependency stages. The site stays a static Astro application; no application code changes are planned because the preflight scan found no affected APIs or configuration. Build and browser checks gate each stage.

**Tech Stack:** pnpm 11.12.0, Node.js >=24, TypeScript 5.8, Astro 6 then Astro 7.0.7, Vite 7 then Vite 8, `@astrojs/cloudflare`, Wrangler, Cloudflare Pages.

---

## File Structure

- Modify: `package.json` - declares pnpm v11, Node >=24, current Node type definitions, and target Astro-related dependency versions.
- Create: `pnpm-workspace.yaml` - allows lifecycle scripts only for reviewed dependencies required by existing tooling.
- Modify: `eslint.config.ts` - excludes Astro virtual TypeScript files from type-aware rules, fixes an invalid glob entry, and bridges the CSS plugin's narrow type at the ESLint boundary.
- Modify: `src/components/Loader.astro` - adopts the current Prettier Astro formatting output.
- Modify: `src/layouts/Layout.astro` - adopts the current Prettier Astro formatting output.
- Modify: `pnpm-lock.yaml` - records the pnpm v11 package-manager resolution, Node type definitions, and the two Astro dependency-resolution stages.
- Inspect only unless a migration validation fails: `astro.config.mts` - keeps static output and the passthrough image service.
- Inspect only unless a migration validation fails: `src/**/*.astro` - is checked by Astro v7's Rust compiler and browser validation.
- Create: `docs/superpowers/plans/2026-07-14-astro-v7-pnpm-v11-upgrade.md` - this implementation procedure.

No test file is created: this task changes build tooling and dependency configuration rather than application behavior. Existing formatting, lint, typecheck, build, and browser checks are the acceptance suite.

No commit step is included because commits must be explicitly requested.

### Task 1: Configure pnpm v11, Node v24+, and Node Type Definitions

**Files:**

- Modify: `package.json:6-15`
- Modify: `package.json:49-65`
- Create: `pnpm-workspace.yaml`
- Modify: `pnpm-lock.yaml`

- [x] **Step 1: Apply the package-manager, runtime, and Node type-definition manifest change**

Replace the relevant `package.json` entries with this exact diff:

```diff
 {
   "name": "@koralle/portfolio",
   "private": true,
   "type": "module",
   "version": "0.0.1",
-  "packageManager": "pnpm@10.11.0",
   "devEngines": {
     "packageManager": {
       "name": "pnpm",
-      "version": ">=10"
+      "version": ">=11.0.0 <12.0.0",
+      "onFail": "download"
     },
     "runtime": {
       "name": "node",
-      "version": ">=22"
+      "version": ">=24.0.0"
     }
   },
@@
-    "@types/node": "^22.15.29",
+    "@types/node": "^26.1.1",
@@
-    "pnpm": "^10.11.0",
     "prettier": "^3.5.3",
```

Create `pnpm-workspace.yaml` with this exact content:

```yaml
allowBuilds:
  esbuild: true
  lefthook: true
  sharp: true
  workerd: true
```

- [x] **Step 2: Resolve the declared pnpm package manager and refreshed Node type definitions**

Run:

```sh
pnpm install
pnpm rebuild esbuild lefthook sharp workerd
```

Expected: both commands exit `0`; no legacy `packageManager` versus `devEngines.packageManager` warning or `ERR_PNPM_IGNORED_BUILDS`; `pnpm-lock.yaml` retains a `packageManagerDependencies` entry for `pnpm@11.12.0`; the project dependency graph resolves `@types/node@26.1.1` or a newer compatible 26.x version.

**Approved lockfile-resolution behavior:** pnpm v11 may resolve unchanged direct `^` ranges to newer versions during this install. For Task 1, the lockfile resolution of `wrangler` changed from `4.20.0` to `4.110.0` while `package.json` intentionally remains `"wrangler": "^4.15.2"`. The resulting 4,602-line lockfile update was disclosed and approved; do not change unchanged direct dependency specifiers until their planned Astro migration stages.

- [x] **Step 3: Verify the active package manager and accepted runtime floor**

Run:

```sh
pnpm --version
pnpm exec node -e "const major = Number(process.versions.node.split('.')[0]); if (major < 24) process.exit(1); console.log(process.version)"
pnpm install --frozen-lockfile
pnpm ignored-builds
```

Expected: pnpm prints `11.12.0`; Node prints a `v24` or later version; all commands exit `0` without changing `pnpm-lock.yaml`; `pnpm ignored-builds` reports no unapproved build scripts.

**Observed red conditions before the repair:**

The failing checks have already been observed before this repair:

```text
pnpm format: Loader.astro and Layout.astro differ under Prettier 3.9.5
pnpm lint: @typescript-eslint/await-thenable has no type information for an Astro virtual file
pnpm typecheck: @eslint/css is not assignable to the generic ESLint Plugin type
```

- [x] **Step 4: Apply the minimal ESLint configuration and typecheck repair**

Update `eslint.config.ts` with these exact changes:

```diff
// eslint.config.ts
-import { ESLint, Linter } from 'eslint';
+import { ESLint } from 'eslint';

   {
     name: '@koralle-portfolio/js',
     files: [
       'src/**/*.ts',
-      'src/**/*.astro, .prettierrc.mjs, panda.config.ts, eslint.config.ts',
+      '.prettierrc.mjs',
+      'panda.config.ts',
+      'eslint.config.ts',
       'astro.config.mts',
       'postcss.config.cjs',
     ],
@@
   {
     name: '@koralle-portfolio/typescript (app)',
     files: ['src/**/*.ts', 'astro.config.mts'],
+    ignores: ['**/*.astro/*.ts'],
     languageOptions: {
-      parser: tseslint.parser as Linter.Parser,
+      parser: tseslint.parser,
@@
     plugins: {
-      '@typescript-eslint': tseslint.plugin as ESLint.Plugin,
+      '@typescript-eslint': tseslint.plugin,
@@
   {
     name: '@koralle-portfolio/typescript (node)',
@@
-      parser: tseslint.parser as Linter.Parser,
+      parser: tseslint.parser,
@@
     plugins: {
-      '@typescript-eslint': tseslint.plugin as ESLint.Plugin,
+      '@typescript-eslint': tseslint.plugin,
@@
   {
     name: '@koralle-portfolio/css',
@@
-    plugins: { css },
+    plugins: { css: css as unknown as ESLint.Plugin },
```

Also update the package script:

```diff
// package.json
-    "typecheck:app": "tsc -p tsconfig.app.json --noEmit",
+    "typecheck:app": "astro check",
     "typecheck:node": "tsc -p tsconfig.node.json --noEmit",
+    "typecheck": "run-p typecheck:*",
@@
+    "@astrojs/check": "^0.9.9",
     "@astrojs/ts-plugin": "^1.10.4",
```

- [x] **Step 5: Apply the current Prettier output only to known affected files**

Run:

```sh
pnpm exec prettier --write \
  docs/superpowers/specs/2026-07-14-astro-v7-upgrade-design.md \
  docs/superpowers/plans/2026-07-14-astro-v7-pnpm-v11-upgrade.md \
  src/components/Loader.astro \
  src/layouts/Layout.astro
```

Expected: only the four named files change; no behavioral source change is introduced.

- [x] **Step 6: Verify the repaired tooling baseline before changing Astro**

Run:

```sh
pnpm format
pnpm lint
pnpm typecheck
pnpm build
```

Expected: each command exits `0`. If a command fails at this point, stop and resolve the pnpm, Node, type-definition, formatter, or ESLint configuration incompatibility before starting the Astro v6 upgrade.

**Task 1 validation results (observed):**

- `pnpm install`: passed with pnpm v11.12.0; the approved lifecycle scripts completed.
- `pnpm --version`: printed `11.12.0`.
- `pnpm exec node -e "..."`: printed `v26.4.0`.
- `pnpm install --frozen-lockfile`: passed without changing the lockfile.
- `pnpm format`, `pnpm lint`, and `pnpm build`: passed.
- `pnpm typecheck`: passed; `typecheck:app` ran `astro check` and `typecheck:node` ran `tsc -p tsconfig.node.json --noEmit`.
- The app pre-commit hook runs `pnpm astro check` when `src/**/*.ts`, `src/**/*.astro`, `astro.config.mts`, `tsconfig.app.json`, `worker-configuration.d.ts`, `package.json`, or `pnpm-lock.yaml` changes; the Node configuration pre-commit hook keeps `pnpm tsc -p tsconfig.node.json --noEmit`.
- `pnpm ignored-builds`: did not enumerate packages because it reported that it could not identify a `node_modules` directory. This is accepted because `node_modules/.modules.yaml` reported `pendingBuilds: []`, `pnpm install` and `pnpm rebuild esbuild lefthook sharp workerd` passed, and all final validation commands passed.

### Task 2: Upgrade and Validate Astro v6

**Files:**

- Modify: `package.json:35-40`
- Modify: `package.json:41-67`
- Modify: `pnpm-lock.yaml`
- Modify: `tsconfig.app.json:12-14`
- Modify: `worker-configuration.d.ts`
- Modify: `src/styles/preflight.css:182`
- Inspect only unless validation fails: `astro.config.mts:1-10`
- Inspect only unless validation fails: `src/**/*.astro`

- [x] **Step 1: Upgrade only to the Astro v6-compatible dependency set**

Run:

```sh
pnpm up astro@^6 @astrojs/cloudflare@^13 wrangler@^4.83.0
```

Expected: `package.json` and `pnpm-lock.yaml` resolve Astro 6, the Cloudflare adapter 13, and Wrangler 4.83.0 or later; no application files change.

- [x] **Step 2: Check the v6 dependency graph**

Run:

```sh
pnpm list astro @astrojs/cloudflare wrangler vite
```

Expected: `astro` has major version `6`, `@astrojs/cloudflare` has major version `13`, `wrangler` satisfies `^4.83.0`, and Vite has major version `7`.

- [x] **Step 3: Run the complete v6 acceptance suite**

Run:

```sh
pnpm format
pnpm lint
pnpm typecheck
pnpm build
```

Expected: each command exits `0`. Treat errors involving content collections, `Astro.glob()`, view-transition internals, Zod, Vite configuration, or Cloudflare tooling as v6 migration blockers. Do not start the v7 upgrade until this suite passes.

**Task 2 validation results (observed):**

- Resolved `astro@6.4.8`, `@astrojs/cloudflare@13.7.0`, `wrangler@4.110.0` (satisfies `^4.83.0`), and `vite@7.3.6`.
- `pnpm format`, `pnpm lint`, `pnpm typecheck` (0 Astro errors, warnings, and hints), and `pnpm build` passed.
- The build generated two static pages.
- The update printed non-blocking `tsconfck@3.0.2` deprecation and peer-dependency warnings.

### Task 3: Upgrade and Validate Astro v7

**Files:**

- Modify: `package.json:35-40`
- Modify: `pnpm-lock.yaml`
- Inspect only unless validation fails: `astro.config.mts:1-10`
- Inspect only unless validation fails: `src/**/*.astro`

- [x] **Step 1: Upgrade to the approved Astro v7 dependency set**

Run:

```sh
pnpm up astro@7.0.7 @astrojs/cloudflare@14.1.2
```

Expected: `package.json` contains `astro@7.0.7` and `@astrojs/cloudflare@14.1.2`; the existing Wrangler range remains `^4.83.0` and its resolved `4.110.0` version satisfies the adapter peer dependency; `pnpm-lock.yaml` is regenerated.

- [x] **Step 2: Check the v7 dependency graph and reserved routing filename**

Run:

```sh
pnpm list astro @astrojs/cloudflare wrangler vite
test ! -e src/fetch.ts
test ! -e src/fetch.js
```

Expected: Astro major version `7`, Cloudflare adapter major version `14`, Wrangler satisfies `^4.83.0`, Vite major version `8`, and both `test` commands exit `0`.

- [x] **Step 3: Resolve v7 peer dependencies and the CSS selector warning**

The failing peer and build-warning checks have already been observed:

```text
@lucide/astro@0.513.0 requires Astro ^4 || ^5
wrangler@4.110.0 requires @cloudflare/workers-types ^5.20260708.1
cssnano-utils@5.0.3 requires PostCSS ^8.5.13
:where(:del) uses an invalid pseudo-class
```

Apply these exact manifest and configuration changes, then generate the Worker types:

```diff
// package.json
-    "@lucide/astro": "^0.513.0",
+    "@lucide/astro": "^1.24.0",
@@
-    "@cloudflare/workers-types": "^4.20250607.0",
+    "@cloudflare/workers-types": "^5.20260713.1",
@@
+    "postcss": "^8.5.19",

// tsconfig.app.json
-    "types": ["@cloudflare/workers-types/2023-07-01"],
+    "types": ["./worker-configuration.d.ts", "node"],

// src/styles/preflight.css
-  :where(:del) {
+  :where(del) {
```

Run:

```sh
pnpm install
pnpm cf-typegen
```

Expected: the lockfile resolves the compatible dependency graph, and `worker-configuration.d.ts` is regenerated by Wrangler using the current `wrangler.jsonc` configuration.

Keep these approved `pnpm-workspace.yaml` entries:

```yaml
overrides:
  '@pandacss/node>picomatch': 4.0.5
  postcss: 8.5.19
  esbuild: 0.28.1
minimumReleaseAgeExclude:
  - '@cloudflare/workers-types@5.20260713.1'
  - postcss@8.5.19
```

The Picomatch override is scoped to Panda Node so `micromatch` retains its compatible Picomatch v2 dependency. The PostCSS and esbuild overrides are global audited remediations that apply to every matching dependency edge. The exclusions bypass pnpm v11's one-day release-age protection only for the two approved exact releases; do not broaden either list.

- [x] **Step 4: Run the complete v7 acceptance suite**

Run:

```sh
pnpm format
pnpm lint
pnpm typecheck
pnpm build
pnpm peers check
```

Expected: each command exits `0`. The build is the Rust compiler check for unclosed or semantically invalid Astro markup and has no invalid-selector warning. `pnpm peers check` reports no unmet peers. Do not modify markup or `astro.config.mts` unless a command identifies the exact file and migration requirement.

**Task 3 validation results (observed):**

- Resolved `astro@7.0.7`, `@astrojs/cloudflare@14.1.2`, `@lucide/astro@1.24.0`, `@cloudflare/workers-types@5.20260713.1`, `postcss@8.5.19`, `wrangler@4.110.0` (declared `^4.83.0`), and `vite@8.1.4`.
- Confirmed `src/fetch.ts` and `src/fetch.js` are absent. `worker-configuration.d.ts` was regenerated with `pnpm cf-typegen`.
- `pnpm format`, `pnpm lint`, `pnpm typecheck` (0 Astro diagnostics), `pnpm build` (no invalid-selector warning), `pnpm peers check`, and `git diff --check` passed.
- Retained the approved scoped `@pandacss/node>picomatch@4.0.5` override, global `postcss@8.5.19` and `esbuild@0.28.1` audited overrides, and exact `@cloudflare/workers-types@5.20260713.1` and `postcss@8.5.19` release-age exclusions.
- The `tsconfck@3.0.2` deprecation warning remains non-blocking.

- [ ] **Step 5: Verify the production directory and Cloudflare Pages preview command**

Run:

```sh
test -f dist/index.html
pnpm preview
```

Expected: `dist/index.html` exists; Wrangler starts a local Pages server without configuration, compatibility-date, or worker-type errors. Keep the server running for Task 4.

### Task 4: Verify Final Rendering and Record the Result

**Files:**

- Inspect only: `src/pages/index.astro:1-18`
- Inspect only: `src/pages/404.astro:1-7`
- Inspect only: `src/layouts/Layout.astro:9-93`
- Inspect only: `wrangler.jsonc:5-13`
- Modify: `src/components/Hero/Hero.astro:39-40` - preserves the space before the inline name span under Astro v7 HTML compression.

- [x] **Step 1: Verify the home page in the local Pages preview**

Open the local URL printed by `pnpm preview` and inspect `/`.

Expected:

```text
Document title: koralle's Portfolio
Main element: #main-content is visible after the loader animation
Content: Hero, About, Skills, Projects, GetInTouch, and Footer are rendered
Assets: no broken image requests
Console: no errors
```

**Observed:** `/` had document title `koralle's Portfolio`. The headings `Hi! I'm koralle!`, `Skills`, `Projects`, `GetInTouch`, and `Feel free to contact me!` rendered, and the GitHub and X links were present. The Astro v7 Hero whitespace regression was repaired with explicit `{' '}` and verified in the browser. The home-page console had no messages. The `sleeping-mugicha` image request returned HTTP `304` (cache-valid).

- [x] **Step 2: Verify the 404 page in the local Pages preview**

Open `/404` on the same local URL.

Expected:

```text
Document title: koralle's Portfolio
Heading: 404 Not Found
Console: no errors
```

**Observed:** `/404` had document title `koralle's Portfolio`, heading `404 Not Found`, and no console messages.

- [x] **Step 3: Inspect Astro v7 whitespace-sensitive output and repair missing JSX whitespace**

The local v7 Pages preview at `/` rendered the Hero's accessible text as `Hi! I'mkoralle!`. The browser console had no errors, and the Hero image request returned HTTP `200`. This reproduces Astro v7's `compressHTML: 'jsx'` whitespace regression between the `Hi! I'm` text node and the following inline `span`.

Repair the missing space explicitly without changing `astro.config.mts`:

```diff
// src/components/Hero/Hero.astro
-        Hi! I'm
+        Hi! I'm{' '}
         <span
```

`GetInTouch` is a pre-existing literal without spaces, not a v7 whitespace regression, and remains unchanged.

Expected: the Hero accessible text is `Hi! I'm koralle!`; no missing spaces, broken line wrapping, or layout shifts occur. Keep `astro.config.mts` unchanged.

**Post-fix validation results (observed):**

- `pnpm exec prettier --write src/components/Hero/Hero.astro`: PASS.
- `pnpm format`: PASS.
- `pnpm lint`: PASS.
- `pnpm typecheck`: PASS with 0 errors, 0 warnings, and 0 hints.
- `pnpm build`: PASS; generated 2 static pages.
- `git diff --check`: PASS with no output.
- The rebuilt Pages preview rendered `Hi! I'm koralle!`, with no console errors and the Hero image request returning HTTP `200` before the controller's final `304` cache validation.

- [x] **Step 4: Stop the preview server and capture the final worktree state**

Stop `pnpm preview` with `Ctrl+C`, then run:

```sh
git diff --check
git status --short
git diff -- package.json pnpm-lock.yaml astro.config.mts
```

Expected: `git diff --check` has no output; only intentional package, lockfile, documentation, and any migration-error-driven source changes are listed. Do not create a commit unless explicitly requested.

**Observed:** Stopped the local preview started as PID `3210`. `GetInTouch` remains intentionally unchanged because its literal contained no space before Astro v7.

### Task 5: Remediate Dependency Audit Findings

**Files:**

- Modify: `package.json:41-68`
- Modify: `pnpm-workspace.yaml:6-10`
- Modify: `pnpm-lock.yaml`

- [x] **Step 1: Remove the unused vulnerable JSON plugin and set patched overrides**

Apply this exact configuration:

```diff
// package.json
-    "@eslint/json": "^0.12.0",
```

// pnpm-workspace.yaml

```yaml
overrides:
  '@pandacss/node>picomatch': 4.0.5
  postcss: 8.5.19
  esbuild: 0.28.1
minimumReleaseAgeExclude:
  - '@cloudflare/workers-types@5.20260713.1'
  - postcss@8.5.19
```

- [x] **Step 2: Regenerate the dependency graph and Panda output**

Run:

```sh
pnpm install
pnpm exec panda codegen
```

Expected: install resolves `@pandacss/node>picomatch@4.0.5` while `micromatch` retains a compatible Picomatch v2; the global PostCSS and esbuild overrides resolve their patched versions across all matching dependency edges; and Panda code generation completes without errors.

- [x] **Step 3: Verify quality, peer, and security gates**

Run:

```sh
pnpm format
pnpm lint
pnpm typecheck
pnpm build
pnpm peers check
pnpm audit --json
git diff --check
```

Expected: all commands exit `0`; peer validation reports no issues; audit metadata reports zero vulnerabilities at every severity; `git diff --check` has no output.

**Observed:** Removed the unused `@eslint/json` direct dependency. The scoped `@pandacss/node>picomatch` override resolved `picomatch@4.0.5`; `micromatch` retained compatible `picomatch@2.3.2`; and the global `postcss@8.5.19` and `esbuild@0.28.1` overrides resolved their patched versions. Panda codegen completed successfully with no generated `styled-system` diff. `pnpm format` and `pnpm lint` passed; `pnpm typecheck` reported 0 errors, 0 warnings, and 0 hints; `pnpm build` generated 2 pages; `pnpm peers check` reported no peer dependency issues; and `git diff --check` had no output. `pnpm audit --json` returned an empty `advisories` object and metadata vulnerability totals of 0 for `info`, `low`, `moderate`, `high`, and `critical`. `pnpm install` reported the deprecated `tsconfck@3.0.2` subdependency; this warning is non-blocking because the audit metadata totals are all zero.
