import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const markupOutfile = join(root, 'node_modules/.cache/ui-markup.test.mjs');

process.chdir(root);

const unit = spawnSync(
  process.execPath,
  [
    '--experimental-strip-types',
    '--test',
    'tests/contrast.test.ts',
    'tests/projects.test.ts',
    'tests/share-url.test.ts',
    'tests/ui.test.ts',
    'tests/ui-layer.test.ts'
  ],
  { stdio: 'inherit', cwd: root }
);

if (unit.status !== 0) {
  process.exit(unit.status ?? 1);
}

mkdirSync(join(root, 'node_modules/.cache'), { recursive: true });

await esbuild.build({
  absWorkingDir: root,
  entryPoints: [join(root, 'tests/ui-markup.test.tsx')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: markupOutfile,
  jsx: 'automatic',
  jsxImportSource: 'preact',
  packages: 'external',
  resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json']
});

const markup = spawnSync(process.execPath, ['--test', markupOutfile], {
  stdio: 'inherit',
  cwd: root
});

process.exit(markup.status ?? 1);
