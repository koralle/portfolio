import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

const uiRoot = new URL('../src/ui', import.meta.url).pathname;

const forbiddenImport =
  /from\s+['"]astro(?:$|\/|:)|from\s+['"]@astrojs\/|import\s+['"]astro(?:$|\/|:)|import\s+['"]@astrojs\//;

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
      continue;
    }
    if (/\.(ts|tsx)$/.test(entry.name)) {
      yield path;
    }
  }
}

void test('ui layer does not import Astro modules', async () => {
  const violations: string[] = [];

  for await (const file of walk(uiRoot)) {
    const source = await readFile(file, 'utf8');
    if (forbiddenImport.test(source)) {
      violations.push(file);
    }
  }

  assert.deepEqual(violations, []);
});
