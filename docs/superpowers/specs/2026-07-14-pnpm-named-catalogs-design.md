# pnpm Named Catalogs Design

## Goal

Replace every direct dependency version in the root `package.json` with a named pnpm catalog reference. Define the exact resolved versions in a new root `pnpm-workspace.yaml`.

The repository is a single-package workspace. Catalogs provide a single place to review and update dependency versions as the project grows.

## Scope

- Create `pnpm-workspace.yaml` with six named catalogs.
- Replace all 30 root dependency specifiers with `catalog:<name>` references.
- Use the root importer versions currently resolved in `pnpm-lock.yaml`, without caret ranges.
- Regenerate `pnpm-lock.yaml` to reflect the catalog references.
- Verify installation, linting, formatting, TypeScript checking, and production build.

## Non-goals

- Upgrade or downgrade any dependency.
- Change `packageManager: "pnpm@10.11.0"` or runtime engine constraints.
- Set `catalogMode`, because the pinned pnpm version is 10.11.0 and the setting was added in pnpm 10.12.1.
- Restructure the project into a multi-package workspace.

## Catalog Layout

`pnpm-workspace.yaml` will contain the following named catalogs. Every value is exact and comes from the current root importer entry in `pnpm-lock.yaml`.

```yaml
catalogs:
  astro:
    '@astrojs/cloudflare': 12.5.4
    '@astrojs/ts-plugin': 1.10.4
    '@lucide/astro': 0.513.0
    astro: 5.9.1
    astro-eslint-parser: 1.2.2
    eslint-plugin-astro: 1.3.1
  cloudflare:
    '@cloudflare/workers-types': 4.20250614.0
    wrangler: 4.20.0
  eslint:
    '@eslint/config-inspector': 1.1.0
    '@eslint/css': 0.9.0
    '@eslint/js': 9.29.0
    '@eslint/json': 0.12.0
    eslint: 9.29.0
    eslint-config-prettier: 10.1.5
    eslint-plugin-jsx-a11y: 6.10.2
    eslint-typegen: 2.2.0
    globals: 16.2.0
    typescript-eslint: 8.34.0
  typescript:
    '@tsconfig/strictest': 2.0.5
    '@types/node': 22.15.31
    typescript: 5.8.3
  styling:
    '@pandacss/dev': 0.53.7
    prettier: 3.5.3
    prettier-plugin-astro: 0.14.1
  tooling:
    gsap: 3.13.0
    jiti: 2.4.2
    lefthook: 1.11.13
    npm-run-all2: 8.0.4
    pnpm: 10.12.1
    rollup-plugin-visualizer: 6.0.3
```

## Dependency Flow

1. `package.json` references each dependency with its catalog protocol, such as `"astro": "catalog:astro"`.
2. pnpm resolves the protocol through the matching value in `pnpm-workspace.yaml`.
3. `pnpm-lock.yaml` records the catalog protocol as the importer specifier and preserves the resolved package versions.
4. Future version upgrades edit the catalog value first, then update the lockfile through pnpm.

## Compatibility and Error Handling

- Exact catalog versions prevent range-based resolution drift for direct dependencies.
- `pnpm install --frozen-lockfile` must succeed after regeneration. A failure indicates that the committed lockfile does not match the catalog references and blocks the change.
- The `pnpm` devDependency remains at its currently resolved 10.12.1, while the Corepack `packageManager` field remains at 10.11.0. This existing difference is intentionally preserved because it is outside the dependency-catalog scope.

## Verification

Run the following commands after the migration:

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm format
pnpm typecheck
pnpm build
```

The migration is successful only if all commands exit with status 0 and the package manager does not report unresolved catalog references.
