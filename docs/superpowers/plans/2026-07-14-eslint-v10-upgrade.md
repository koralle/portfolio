# ESLint v10 Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade ESLint and all direct ESLint-related dependencies to their latest stable releases while preserving lint coverage and passing the project's quality gates.

**Architecture:** Version declarations stay centralized in pnpm named catalogs. The install process regenerates the lockfile from those declarations, then the existing ESLint flat config, package scripts, and Lefthook hooks are validated in place. Source or configuration changes are permitted only when a command demonstrates an ESLint v10 or plugin-upgrade incompatibility.

**Tech Stack:** pnpm 11, Node.js 26, ESLint 10, typescript-eslint 8, eslint-plugin-astro 3, @eslint/css 1, Astro 7.

---

## File Structure

| File                  | Responsibility                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm-workspace.yaml` | Declares the catalog-pinned ESLint-related package versions.                                                                          |
| `pnpm-lock.yaml`      | Pins the dependency graph resolved from the updated catalogs.                                                                         |
| `eslint.config.ts`    | Removes the upgraded CSS plugin's unnecessary type assertion and retains the flat configuration.                                      |
| `package.json`        | Declares the Node.js runtime expression required by `eslint-plugin-astro@3.0.0`; lint commands change only if ESLint 10 rejects them. |
| `lefthook.yaml`       | Existing staged-file lint hook; modify only if ESLint 10 rejects its invocation.                                                      |

### Task 1: Upgrade the ESLint Catalog

**Files:**

- Modify: `pnpm-workspace.yaml:20-34`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Update only the direct ESLint-related catalog entries**

Replace the affected entries while leaving all non-ESLint package versions unchanged:

```yaml
catalogs:
  astro:
    astro-eslint-parser: 3.0.0
    eslint-plugin-astro: 3.0.0
  eslint:
    '@eslint/config-inspector': 3.0.4
    '@eslint/css': 1.4.0
    '@eslint/js': 10.0.1
    eslint: 10.7.0
    eslint-config-prettier: 10.1.8
    eslint-plugin-jsx-a11y: 6.10.2
    eslint-typegen: 2.3.1
    globals: 17.7.0
    typescript-eslint: 8.63.0
```

- [ ] **Step 2: Regenerate the lockfile and install dependencies**

Run:

```sh
pnpm install
```

Expected: exit status 0 and `pnpm-lock.yaml` updates to resolve ESLint 10.7.0 and the six related package targets. The accepted `eslint-plugin-jsx-a11y@6.10.2` peer incompatibility is recorded separately in Task 2, Step 6.

- [ ] **Step 3: Confirm that only the intended direct lint dependencies changed**

Run:

```sh
pnpm outdated --format json
```

Expected: the output does not list `eslint`, `@eslint/js`, `@eslint/config-inspector`, `@eslint/css`, `eslint-plugin-astro`, `astro-eslint-parser`, or `globals`; unrelated outdated dependencies may remain.

- [ ] **Step 4: Verify a frozen install accepts the regenerated lockfile**

Run:

```sh
pnpm install --frozen-lockfile
```

Expected: exit status 0 with no lockfile changes.

### Task 2: Validate ESLint v10 Runtime Compatibility

**Files:**

- Verify: `eslint.config.ts:1-161`
- Modify: `eslint.config.ts:5-7, 94`
- Modify: `package.json:12-15`
- Verify: `lefthook.yaml:1-57`
- Modify only on further observed incompatibility: `eslint.config.ts`, `package.json`, `lefthook.yaml`, or the exact source file reported by ESLint

- [ ] **Step 1: Update the Node.js engine range and remove the unnecessary CSS plugin assertion**

Apply these exact edits:

```json
{
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "^24.16.0 || >=26.3.0"
    }
  }
}
```

```ts
// eslint.config.ts
import css from '@eslint/css';

// Remove: import { ESLint } from 'eslint';

plugins: { css },
```

Expected: `package.json` uses `^24.16.0 || >=26.3.0`, keeping Node.js 24 as the lowest supported major line while intentionally excluding unsupported Node.js 25.x and Node.js 26.0.0-26.2.x to match `eslint-plugin-astro@3.0.0`'s engines range. Node.js 22 is not a supported project runtime. `@typescript-eslint/no-unnecessary-type-assertion` no longer reports the CSS plugin registration.

- [ ] **Step 2: Run the upgraded linter before applying automated fixes**

Run:

```sh
pnpm lint
```

Expected: exit status 0. This checks TypeScript type-aware rules, Astro rules, CSS rules, the TypeScript flat config loader, and ESLint 10's newly enabled recommended rules.

- [ ] **Step 3: Diagnose an unexpected lint failure before changing configuration or source**

If Step 2 fails, invoke `superpowers:systematic-debugging` and preserve the complete diagnostic output. Classify the failure as exactly one of:

| Failure class                                     | Required correction                                                                                         |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| New `eslint:recommended` diagnostic               | Correct the reported source code; retain the rule.                                                          |
| Invalid ESLint v10 option or flat-config behavior | Make the smallest equivalent edit in `eslint.config.ts`.                                                    |
| Astro or CSS plugin compatibility error           | Update the affected plugin configuration based on its error message; do not disable all Astro or CSS rules. |
| Unsupported CLI argument in a script or hook      | Remove or replace only that argument in `package.json` or `lefthook.yaml`.                                  |

After each correction, rerun `pnpm lint`. Expected: exit status 0 before proceeding.

- [ ] **Step 4: Confirm the config inspector starts with the upgraded ESLint API**

Run:

```sh
pnpm lint:inspect --help
```

Expected: exit status 0 and the inspector help text; it must not report an ESLint API or configuration loading error. Do not pass a literal `--`, because that forwards it to the inspector and starts its long-running server.

- [ ] **Step 5: Confirm the staged-file hook's lint command resolves**

Run:

```sh
pnpm exec eslint src --fix-dry-run --config eslint.config.ts --no-cache
```

Expected: exit status 0. This validates the staged-file hook's ESLint arguments without modifying files.

- [ ] **Step 6: Record the accepted jsx-a11y peer incompatibility without suppressing it**

Run:

```sh
pnpm peers check
```

Expected: this command reports that `eslint-plugin-jsx-a11y@6.10.2` declares support through ESLint 9 while the project installs ESLint 10.7.0. Do not add `peerDependencyRules`, overrides, or patches to hide this result; the project explicitly accepts the risk while retaining the latest package release.

### Task 3: Run the Full Project Quality Gate

**Files:**

- Verify: repository-wide source and configuration files
- Modify only on observed upgrade-induced failures: exact file reported by the failing command

- [ ] **Step 1: Check formatting without modifying files**

Run:

```sh
pnpm format
```

Expected: exit status 0.

- [ ] **Step 2: Run application and Node.js type checks**

Run:

```sh
pnpm typecheck
```

Expected: exit status 0. This confirms the updated ESLint config types and Astro project types remain valid.

- [ ] **Step 3: Build the production site**

Run:

```sh
pnpm build
```

Expected: exit status 0.

- [ ] **Step 4: Check the resolved dependency graph for known advisories**

Run:

```sh
pnpm audit
```

Expected: exit status 0 with no known vulnerabilities.

- [ ] **Step 5: Validate the final patch**

Run:

```sh
git diff --check
git status --short
```

Expected: `git diff --check` produces no output. `git status --short` lists only the dependency manifests, lockfile, and files changed to resolve observed ESLint 10 compatibility diagnostics.
