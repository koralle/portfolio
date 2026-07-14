# pnpm Named Catalogs Design

## Goal

Move every direct dependency version in the root `package.json` to named pnpm catalogs. Use the exact versions currently resolved in `node_modules`, so the migration removes caret ranges without changing the installed direct-dependency graph.

## Scope

- Extend the existing root `pnpm-workspace.yaml`; do not remove its build-script policy, overrides, or release-age exclusions.
- Define six named catalogs for all 30 root dependencies.
- Replace every root dependency specifier with `catalog:<name>`.
- Use exact versions from `pnpm list --depth 0 --json`.
- Regenerate `pnpm-lock.yaml` using pnpm 11.12.0.
- Run the existing install, lint, format, typecheck, and build checks.

## Non-goals

- Upgrade or downgrade a direct dependency.
- Change the pnpm v11 or Node v24+ policies in `devEngines`.
- Change the existing allowlisted lifecycle scripts, non-catalog overrides, or release-age exclusions.
- Restructure the project into a multi-package workspace.

## Catalog Layout

`pnpm-workspace.yaml` retains its existing top-level settings and adds the following named catalogs. The `postcss` override uses the same styling catalog value, eliminating a duplicated version declaration.

```yaml
allowBuilds:
  esbuild: true
  lefthook: true
  sharp: true
  workerd: true
overrides:
  '@pandacss/node>picomatch': 4.0.5
  postcss: catalog:styling
  esbuild: 0.28.1
minimumReleaseAgeExclude:
  - '@cloudflare/workers-types@5.20260713.1'
  - postcss@8.5.19
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

## Dependency Flow

1. `package.json` references each dependency with its catalog protocol, such as `"astro": "catalog:astro"`.
2. pnpm 11 resolves the protocol through the named value in `pnpm-workspace.yaml`.
3. The `postcss` direct dependency and its workspace override use the shared `styling` catalog value.
4. `pnpm install --lockfile-only` records catalog protocols in `pnpm-lock.yaml`. The `postcss` importer is normalized to the exact workspace override value (`8.5.19`) instead of retaining `catalog:styling`.
5. Future direct-dependency upgrades edit one catalog value and regenerate the lockfile.

## Error Handling and Verification

- Before the migration, a structural assertion must confirm that the manifest still has non-catalog references; this demonstrates the assertion can detect an incomplete migration.
- After the migration, the same assertion must confirm all 30 root dependency specifiers begin with `catalog:` and none of the catalog values begins with `^`.
- `pnpm install --frozen-lockfile` must succeed after lockfile generation. A failure blocks the change because the lockfile and catalog references are inconsistent.
- Run `pnpm lint`, `pnpm format`, `pnpm typecheck`, and `pnpm build`. All commands must exit with status 0.

## Version Source

The current lockfile root importer does not list direct dependencies, so it cannot map each direct specifier to a resolved version. `pnpm list --depth 0 --json` provides that mapping from the current pnpm 11 installation. Its output is the source for the exact catalog values above.

## Source

- https://pnpm.io/catalogs
