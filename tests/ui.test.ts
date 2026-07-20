import assert from 'node:assert/strict';
import test from 'node:test';
import { ui } from '../src/i18n/ui.ts';

const requiredKeys = [
  'navAbout',
  'navSkills',
  'navProjects',
  'navContact',
  'heroSupporting',
  'ctaProjects',
  'ctaContact',
  'projectsEmpty',
  'skipToContent',
  'navLabel'
] as const;

void test('uses the English contact heading in both locales', () => {
  assert.equal(ui.en.footerHeading, 'Feel free to contact me!');
  assert.equal(ui.ja.footerHeading, ui.en.footerHeading);
});

void test('exposes navigation and hero CTA copy in both locales', () => {
  for (const key of requiredKeys) {
    assert.equal(typeof ui.en[key], 'string');
    assert.ok(ui.en[key].length > 0);
    assert.equal(typeof ui.ja[key], 'string');
    assert.ok(ui.ja[key].length > 0);
  }
});
