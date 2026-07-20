import assert from 'node:assert/strict';
import test from 'node:test';
import { contrastRatio } from '../src/lib/contrast.ts';

void test('primary pink on base dark meets WCAG AA for normal text', () => {
  assert.ok(contrastRatio('#ec93a1', '#1a1a1a') >= 4.5);
});

void test('body text on base dark meets WCAG AA', () => {
  assert.ok(contrastRatio('#e0e0e0', '#1a1a1a') >= 4.5);
});

void test('muted text on base dark meets WCAG AA', () => {
  assert.ok(contrastRatio('#c4c8d0', '#1a1a1a') >= 4.5);
});
