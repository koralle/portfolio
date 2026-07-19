import assert from 'node:assert/strict';
import test from 'node:test';
import { getShareUrl } from '../src/lib/share-url.ts';

void test('returns the production URL for the English home page', () => {
  assert.equal(getShareUrl('/'), 'https://me.koralle-mgmg.com/');
});

void test('returns the production URL for the Japanese home page', () => {
  assert.equal(getShareUrl('/ja/'), 'https://me.koralle-mgmg.com/ja/');
});
