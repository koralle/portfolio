# pnpm Named Catalogs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralize all 30 direct dependency versions in named pnpm catalogs, with exact versions matching the current pnpm 11 installation.

**Architecture:** Preserve the existing pnpm v11 workspace policy, then add six catalogs to it. The root manifest consumes those catalogs through `catalog:<name>`, and the existing PostCSS override consumes the same styling catalog. pnpm regenerates the lockfile after the protocol migration.

**Tech Stack:** pnpm 11.12.0, Node.js 24+, YAML, JSON, Astro 7.

---

## File Structure

- Modify: `pnpm-workspace.yaml` - retains build-script controls, overrides, and release-age exclusions while defining the six named catalogs.
- Modify: `package.json` - replaces all dependency ranges with catalog protocol references.
- Modify: `pnpm-lock.yaml` - records the catalog protocol specifiers and preserves the resolved graph.
- Modify: `docs/superpowers/specs/2026-07-14-pnpm-named-catalogs-design.md` - records the current pnpm 11 baseline and exact catalog values.

No test file is required: the change is package-manager configuration. A manifest assertion, frozen installation, and the established quality commands are the acceptance suite.

No commit step is included because commits require an explicit request.

### Task 1: Verify the Pre-migration Manifest Assertion

**Files:**

- Inspect: `package.json:35-68`

- [ ] **Step 1: Run the assertion before any migration change**

Run:

```sh
node -e "const p=require('./package.json'); const d={...p.dependencies,...p.devDependencies}; if (Object.values(d).every((v) => v.startsWith('catalog:'))) process.exit(0); process.exit(1)"
```

Expected: exit status `1`, because the current manifest still contains direct ranges and versions. This proves the assertion detects an incomplete catalog migration.

### Task 2: Add Exact Named Catalogs and Convert the Manifest

**Files:**

- Modify: `pnpm-workspace.yaml:1-12`
- Modify: `package.json:35-68`

- [ ] **Step 1: Update the workspace configuration without removing existing policy**

Retain `allowBuilds`, `@pandacss/node>picomatch`, `esbuild`, and `minimumReleaseAgeExclude`. Change the PostCSS override and append this catalog configuration:

```yaml
overrides:
  '@pandacss/node>picomatch': 4.0.5
  postcss: catalog:styling
  esbuild: 0.28.1
catalogs:
  astro:
    '@astrojs/check': 0.9.9
    '@astrojs/cloudflare': 14.1.2
    '@astrojs/ts-plugin': 1.10.10
    '@lucide/astro': 1.24.0
    astro: 7.0.7
    astro-eslint-parser: 1.4.0
    eslint-plugin-astro: 1.7.0
  cloudflare:
    '@cloudflare/workers-types': 5.20260713.1
    wrangler: 4.110.0
  eslint:
    '@eslint/config-inspector': 1.5.0
    '@eslint/css': 0.9.0
    '@eslint/js': 9.39.5
    eslint: 9.39.5
    eslint-config-prettier: 10.1.8
    eslint-plugin-jsx-a11y: 6.10.2
    eslint-typegen: 2.3.1
    globals: 16.5.0
    typescript-eslint: 8.63.0
  typescript:
    '@tsconfig/strictest': 2.0.8
    '@types/node': 26.1.1
    typescript: 5.9.3
  styling:
    '@pandacss/dev': 0.53.7
    postcss: 8.5.19
    prettier: 3.9.5
    prettier-plugin-astro: 0.14.1
  tooling:
    gsap: 3.15.0
    jiti: 2.7.0
    lefthook: 1.13.6
    npm-run-all2: 8.0.4
    rollup-plugin-visualizer: 6.0.11
```

- [ ] **Step 2: Replace every root dependency specifier with its named catalog reference**

Apply these catalog mappings in `package.json`:

```json
{
  "dependencies": {
    "@astrojs/cloudflare": "catalog:astro",
    "@lucide/astro": "catalog:astro",
    "astro": "catalog:astro",
    "gsap": "catalog:tooling"
  },
  "devDependencies": {
    "@astrojs/check": "catalog:astro",
    "@astrojs/ts-plugin": "catalog:astro",
    "@cloudflare/workers-types": "catalog:cloudflare",
    "@eslint/config-inspector": "catalog:eslint",
    "@eslint/css": "catalog:eslint",
    "@eslint/js": "catalog:eslint",
    "@pandacss/dev": "catalog:styling",
    "@tsconfig/strictest": "catalog:typescript",
    "@types/node": "catalog:typescript",
    "astro-eslint-parser": "catalog:astro",
    "eslint": "catalog:eslint",
    "eslint-config-prettier": "catalog:eslint",
    "eslint-plugin-astro": "catalog:astro",
    "eslint-plugin-jsx-a11y": "catalog:eslint",
    "eslint-typegen": "catalog:eslint",
    "globals": "catalog:eslint",
    "jiti": "catalog:tooling",
    "lefthook": "catalog:tooling",
    "npm-run-all2": "catalog:tooling",
    "postcss": "catalog:styling",
    "prettier": "catalog:styling",
    "prettier-plugin-astro": "catalog:styling",
    "rollup-plugin-visualizer": "catalog:tooling",
    "typescript": "catalog:typescript",
    "typescript-eslint": "catalog:eslint",
    "wrangler": "catalog:cloudflare"
  }
}
```

- [ ] **Step 3: Confirm the manifest is fully catalog-backed**

Run:

```sh
node -e "const p=require('./package.json'); const d={...p.dependencies,...p.devDependencies}; if (Object.keys(d).length !== 30 || Object.values(d).some((v) => !v.startsWith('catalog:'))) process.exit(1)"
```

Expected: exit status `0`. The command verifies both the expected dependency count and catalog protocol coverage.

### Task 3: Regenerate and Validate the Lockfile

**Files:**

- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Regenerate the lockfile with the declared exact versions**

Run:

```sh
pnpm install --lockfile-only
```

Expected: exit status `0`. The root importer records catalog protocol specifiers. The `postcss` importer is expected to record the exact `8.5.19` override value; every other direct dependency records its named catalog specifier. Resolved direct dependency versions remain the exact values declared in `pnpm-workspace.yaml`.

- [ ] **Step 2: Validate reproducible installation**

Run:

```sh
pnpm install --frozen-lockfile
```

Expected: exit status `0` with no lockfile changes and no unresolved catalog protocol error.

- [ ] **Step 3: Run the established quality suite**

Run:

```sh
pnpm lint
pnpm format
pnpm typecheck
pnpm build
```

Expected: every command exits with status `0`.

### Task 4: Review the Migration Diff

**Files:**

- Inspect: `package.json`
- Inspect: `pnpm-workspace.yaml`
- Inspect: `pnpm-lock.yaml`

- [ ] **Step 1: Verify only intended dependency-configuration files changed**

Run:

```sh
git diff --check
git status --short
```

Expected: no whitespace errors; only catalog-related manifest, workspace, and lockfile changes are present, aside from the already-approved documentation updates.
