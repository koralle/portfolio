# ESLint v10 Upgrade Design

## Goal

Keep ESLint as the project's linter while upgrading ESLint 9 and every direct ESLint-related package to its latest stable release. Preserve the existing lint coverage for TypeScript, Astro, and CSS.

## Scope

Update these catalog entries:

| Package                    | Current  | Target   |
| -------------------------- | -------- | -------- |
| `eslint`                   | `9.39.5` | `10.7.0` |
| `@eslint/js`               | `9.39.5` | `10.0.1` |
| `@eslint/config-inspector` | `1.5.0`  | `3.0.4`  |
| `@eslint/css`              | `0.9.0`  | `1.4.0`  |
| `eslint-plugin-astro`      | `1.7.0`  | `3.0.0`  |
| `astro-eslint-parser`      | `1.4.0`  | `3.0.0`  |
| `globals`                  | `16.5.0` | `17.7.0` |

Regenerate `pnpm-lock.yaml` using pnpm 11.12.0 after updating the catalogs.

Do not update unrelated dependencies, including TypeScript, Panda CSS, Lefthook, or the formatter stack. `typescript-eslint`, `eslint-config-prettier`, `eslint-plugin-jsx-a11y`, `eslint-typegen`, and `jiti` are already at their latest versions and remain unchanged.

Update the Node.js runtime expression in `package.json` from `>=24.0.0` to `^24.16.0 || >=26.3.0`. This keeps Node.js 24 as the lowest supported major line while intentionally excluding unsupported Node.js 25.x and Node.js 26.0.0-26.2.x to match `eslint-plugin-astro@3.0.0`'s engines range. Node.js 22 is not a supported project runtime. Update `eslint.config.ts` only to remove the type assertion that ESLint reports as unnecessary after the `@eslint/css` upgrade.

## Compatibility

The project requires Node.js `^24.16.0 || >=26.3.0` and was verified with Node.js `v26.4.0`. This keeps Node.js 24 as the lowest supported major line while intentionally excluding unsupported Node.js 25.x and Node.js 26.0.0-26.2.x to match `eslint-plugin-astro@3.0.0`'s engines range. Node.js 22 is not a supported project runtime. This satisfies ESLint v10's supported Node.js versions and `eslint-plugin-astro@3.0.0`'s Node.js peer dependency.

`eslint-plugin-astro@3.0.0` requires ESLint 10 or later. Its optional peer dependencies are `@typescript-eslint/parser >=8.61.0` and `eslint-plugin-jsx-a11y >=6.10.2`; the project installs both. `typescript-eslint@8.63.0` supports ESLint 10. TypeScript 7 is intentionally out of scope because the installed `typescript-eslint@8.63.0` peer dependency range does not include it.

`eslint-plugin-jsx-a11y@6.10.2`, its latest release, declares ESLint peer support only through v9. The project explicitly accepts this unsupported peer relationship to prioritize ESLint 10. Do not suppress or rewrite the peer declaration with pnpm configuration, because that would conceal rather than resolve the unsupported contract. The migration remains contingent on successful lint, typecheck, and build validation.

## Implementation Design

1. Update only the scoped catalog versions in `pnpm-workspace.yaml`.
2. Run `pnpm install` to regenerate the lockfile and validate peer dependencies.
3. Run `pnpm lint` to identify behavior changes from ESLint v10 and the upgraded Astro/CSS plugins.
4. Remove `css as unknown as ESLint.Plugin` and its now-unused `ESLint` import from `eslint.config.ts`; this is the exact expression reported by `@typescript-eslint/no-unnecessary-type-assertion` after upgrading `@eslint/css`.
5. Fix any further reported source or configuration issues first. Disable a rule only when retaining the rule would be incorrect for this project, and document the reason inline in `eslint.config.ts`.
6. Change `package.json` scripts or `lefthook.yaml` only when validation demonstrates an incompatibility or deprecated invocation. Existing explicit `--config eslint.config.ts` usage should be retained unless it fails.

ESLint v10 expands `eslint:recommended` with `no-unassigned-vars`, `no-useless-assignment`, and `preserve-caught-error`. New diagnostics from these rules are expected and are handled through the source-first policy above.

## Validation

All commands must exit with status 0:

```sh
pnpm format
pnpm lint
pnpm typecheck
pnpm build
pnpm audit
```

Also run `pnpm install` and inspect its peer-dependency output. Run `git diff --check` to verify the resulting patch has no whitespace errors.

## Risks

- `eslint-plugin-jsx-a11y@6.10.2` has no declared ESLint 10 peer support. This is an accepted compatibility risk; pnpm peer-validation tooling will continue to report it until the upstream package expands its peer range.
- Major upgrades of `eslint-plugin-astro` and `@eslint/css` can introduce rule or parser behavior changes not covered by ESLint's v10 migration guide.
- ESLint v10's expanded recommended rules can expose pre-existing issues. Root-cause fixes can change source files beyond dependency manifests, but only where required for a clean lint result.
- The `@eslint/config-inspector` major upgrade is not part of the quality gate; verify its command still launches after dependency installation.

## Sources

- https://eslint.org/docs/latest/use/migrate-to-10.0.0
- `pnpm outdated --format json`, executed 2026-07-14
- `pnpm view <package>@<version> peerDependencies --json`, executed 2026-07-14
