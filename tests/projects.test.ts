import assert from 'node:assert/strict';
import test from 'node:test';
import { filterProjectsByLocale, sortProjects } from '../src/lib/projects.ts';

void test('filters projects by locale', () => {
  const entries = [
    { id: 'a', data: { locale: 'en' as const, order: 2 } },
    { id: 'b', data: { locale: 'ja' as const, order: 1 } },
    { id: 'c', data: { locale: 'en' as const, order: 1 } }
  ];
  assert.deepEqual(
    filterProjectsByLocale(entries, 'en').map(entry => entry.id),
    ['a', 'c']
  );
});

void test('sorts projects by ascending order', () => {
  const entries = [
    { id: 'a', data: { order: 2 } },
    { id: 'b', data: { order: 1 } }
  ];
  assert.deepEqual(
    sortProjects(entries).map(entry => entry.id),
    ['b', 'a']
  );
});
