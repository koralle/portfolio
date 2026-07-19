import assert from 'node:assert/strict';
import test from 'node:test';
import { ui } from '../src/i18n/ui.ts';

test('uses the English contact heading in both locales', () => {
  assert.equal(ui.en.footerHeading, 'Feel free to contact me!');
  assert.equal(ui.ja.footerHeading, ui.en.footerHeading);
});
