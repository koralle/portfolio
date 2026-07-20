# ポートフォリオデザイン洗練 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 既存ブランド（ダーク / ピンク / Rounded M Plus / Mugicha）を維持したまま、Hero をブランド先行フルブリードに再構成し、About → Skills → Projects → Contact の証明導線と a11y を整える。

**Architecture:** Panda のセマンティックトークンを土台にし、`Layout` にスキップリンクとアンカーナビを追加する。Hero / Loader / ContentSection / Footer をトークンと reduced-motion 対応で磨く。Projects は home MDX（枠）と新 `projects` コレクション（項目）に分離し、空なら「準備中」を出す。

**Tech Stack:** Astro 7、Panda CSS、GSAP（SplitText / ScrollTrigger）、MDX content collections、`node:test`、TypeScript

## Global Constraints

- ビジュアル: ダーク基調・ピンク `#ec93a1`・Rounded M Plus 1c・Mugicha を維持する
- a11y がビジュアルと衝突したら a11y を優先する（WCAG AA、フォーカス、reduced-motion）
- 偽のプロジェクト実績は作らない。コレクション空なら「準備中 / coming soon」
- ページ経路に乗っていないスタブ（`About.astro` / `Projects.astro` / `Skills.astro` / `GetInTouch.astro`）は原則触らない
- 仕様書: `docs/superpowers/specs/2026-07-19-portfolio-design-refinement-design.md`

---

## File Structure

- Modify: `panda.config.ts` — `bg.base` / `bg.raised` / `text` / `text.muted` / `primary` / focus・幅トークン
- Create: `src/lib/contrast.ts` — 相対輝度とコントラスト比
- Create: `tests/contrast.test.ts` — ブランド色の AA 検証
- Modify: `src/i18n/ui.ts` — ナビ・CTA・Hero 補足・準備中コピー
- Modify: `tests/ui.test.ts` — 新キーの存在と両ロケール整合
- Create: `src/components/SiteHeader/SiteHeader.astro` + `index.ts` — アンカーナビと言語切替
- Modify: `src/layouts/Layout.astro` — スキップリンク、SiteHeader、フォーカス用グローバル、Loader reduced-motion
- Modify: `src/components/Hero/Hero.astro` — ブランド先行フルブリード、CTA、reduced-motion
- Modify: `src/components/Loader.astro` — トークン化（必要なら）
- Modify: `src/components/ContentSection/ContentSection.astro` — トークン、見出し reveal、Projects 差し込み口
- Create: `src/lib/projects.ts` — ロケール絞り込みと order ソート
- Create: `tests/projects.test.ts`
- Modify: `src/content.config.ts` — `projects` コレクションスキーマ
- Create: `src/components/ProjectList/ProjectList.astro` + `index.ts`
- Modify: `src/pages/index.astro` / `src/pages/[...locale]/index.astro` — projects 取得と受け渡し
- Modify: `src/content/home/{en,ja}.{about,skills,projects,contact}.mdx` — コピー整理
- Modify: `src/components/Footer/Footer.astro` — 高さ・`id="footer"`・トークン
- Create: `docs/superpowers/plans/2026-07-19-portfolio-design-refinement.md` — 本プラン

---

### Task 1: コントラストヘルパーとデザイントークン

**Files:**

- Create: `src/lib/contrast.ts`
- Create: `tests/contrast.test.ts`
- Modify: `panda.config.ts`
- Test: `tests/contrast.test.ts`

**Interfaces:**

- Consumes: なし
- Produces:
  - `hexToRgb(hex: string): { r: number; g: number; b: number }`
  - `relativeLuminance(hex: string): number`
  - `contrastRatio(foregroundHex: string, backgroundHex: string): number`
  - Panda semantic tokens: `colors.bg.base`, `colors.bg.raised`, `colors.text`, `colors.text.muted`, `colors.primary`, `colors.focus`

- [x] **Step 1: 失敗するコントラストテストを書く**

`tests/contrast.test.ts`:

```ts
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
```

- [x] **Step 2: テストを実行して失敗を確認する**

Run:

```sh
node --experimental-strip-types --test tests/contrast.test.ts
```

Expected: FAIL（`contrastRatio` 未定義）

- [x] **Step 3: 最小実装を書く**

`src/lib/contrast.ts`:

```ts
export const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) {
    throw new Error(`Unsupported hex color: ${hex}`);
  }
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16)
  };
};

const channelLuminance = (channel: number) => {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

export const relativeLuminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
};

export const contrastRatio = (foregroundHex: string, backgroundHex: string) => {
  const lighter = Math.max(relativeLuminance(foregroundHex), relativeLuminance(backgroundHex));
  const darker = Math.min(relativeLuminance(foregroundHex), relativeLuminance(backgroundHex));
  return (lighter + 0.05) / (darker + 0.05);
};
```

- [x] **Step 4: テストを通す**

Run:

```sh
node --experimental-strip-types --test tests/contrast.test.ts
```

Expected: PASS（primary は約 7.67:1）

- [x] **Step 5: Panda セマンティックトークンを定義する**

`panda.config.ts` を次の形へ更新する（`defineConfig` の `theme.semanticTokens`）:

```ts
import { defineConfig, defineGlobalStyles } from '@pandacss/dev';

const globalStyles = defineGlobalStyles({
  ':root, body': {
    color: '{colors.text}',
    backgroundColor: '{colors.bg.base}'
  },
  ':focus-visible': {
    outline: '2px solid {colors.focus}',
    outlineOffset: '2px'
  }
});

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx,astro}'],
  exclude: [],
  theme: {
    tokens: {},
    semanticTokens: {
      colors: {
        bg: {
          base: { value: '#1a1a1a' },
          raised: { value: '#212121' }
        },
        text: {
          DEFAULT: { value: '#e0e0e0' },
          muted: { value: '#c4c8d0' }
        },
        primary: { value: '#ec93a1' },
        focus: { value: '#ec93a1' }
      },
      sizes: {
        content: { value: '960px' },
        wide: { value: '1440px' }
      }
    },
    extend: {
      breakpoints: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      }
    }
  },
  globalCss: globalStyles,
  outdir: 'styled-system'
});
```

メモ: `#ec93a1` on `#1a1a1a` は AA を満たすため `primary.accessible` は作らない。将来色を変えるとき Task 1 のテストが退行を検知する。

- [x] **Step 6: codegen して型確認する**

Run:

```sh
pnpm prepare
pnpm typecheck
```

Expected: 両方 exit `0`

- [x] **Step 7: Commit**

```bash
git add src/lib/contrast.ts tests/contrast.test.ts panda.config.ts
git commit -m "feat: add contrast helpers and semantic color tokens"
```

---

### Task 2: UI コピー（ナビ / CTA / Hero 補足 / 準備中）

**Files:**

- Modify: `src/i18n/ui.ts`
- Modify: `tests/ui.test.ts`
- Test: `tests/ui.test.ts`

**Interfaces:**

- Consumes: 既存 `getUi(locale)`
- Produces: `ui[locale]` に次のキーを追加  
  `navAbout`, `navSkills`, `navProjects`, `navContact`, `heroSupporting`, `ctaProjects`, `ctaContact`, `projectsEmpty`, `skipToContent`, `navLabel`

- [x] **Step 1: 失敗する UI テストを追加する**

`tests/ui.test.ts` を次で置き換え（既存アサーションも維持）:

```ts
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
```

- [x] **Step 2: テストを実行して失敗を確認する**

Run:

```sh
node --experimental-strip-types --test tests/ui.test.ts
```

Expected: FAIL（キー欠落）

- [x] **Step 3: `ui.ts` にキーを追加する**

`src/i18n/ui.ts` の各ロケールに追加（既存キーは維持）:

```ts
// en
navLabel: 'Primary',
skipToContent: 'Skip to content',
navAbout: 'About',
navSkills: 'Skills',
navProjects: 'Projects',
navContact: 'Contact',
heroSupporting: 'Accessible UI, playful interaction, lasting front-end craft.',
ctaProjects: 'See projects',
ctaContact: 'Contact',
projectsEmpty: 'Coming soon — project write-ups are being prepared.',

// ja
navLabel: '主要',
skipToContent: '本文へスキップ',
navAbout: 'About',
navSkills: 'Skills',
navProjects: 'Projects',
navContact: 'Contact',
heroSupporting: 'アクセシブルなUI、遊び心のあるインタラクション、長く育てるフロントエンド。',
ctaProjects: 'Projects を見る',
ctaContact: 'Contact',
projectsEmpty: '準備中 — プロジェクト紹介を整えています。',
```

`heroName` は引き続き `koralle`。`heroGreetingPrefix` / `heroLead` は残してよいが、Hero 実装ではブランド名を最大信号として再配置する。

- [x] **Step 4: テストを通す**

Run:

```sh
node --experimental-strip-types --test tests/ui.test.ts
```

Expected: PASS

- [x] **Step 5: Commit**

```bash
git add src/i18n/ui.ts tests/ui.test.ts
git commit -m "feat: add nav, CTA, and empty-projects UI copy"
```

---

### Task 3: スキップリンクと SiteHeader

**Files:**

- Create: `src/components/SiteHeader/SiteHeader.astro`
- Create: `src/components/SiteHeader/index.ts`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/pages/index.astro`（messages はそのまま Layout 経由で足りるならページ変更最小）
- Modify: `src/pages/[...locale]/index.astro`（同上）

**Interfaces:**

- Consumes: `Locale`, `getUi` の戻り、`pathForLocale`, `localeLabels`
- Produces: `<SiteHeader locale messages />` — `#about` `#skills` `#projects` `#contact` へのリンク、言語切替

- [x] **Step 1: SiteHeader を作成する**

`src/components/SiteHeader/index.ts`:

```ts
export { default as SiteHeader } from './SiteHeader.astro';
```

`src/components/SiteHeader/SiteHeader.astro`:

```astro
---
import { css } from '../../../styled-system/css';
import { localeLabels, pathForLocale, type Locale } from '../../i18n/config';
import type { getUi } from '../../i18n/ui';

interface Props {
  locale: Locale;
  messages: ReturnType<typeof getUi>;
}

const { locale, messages } = Astro.props;

const links = [
  { href: '#about', label: messages.navAbout },
  { href: '#skills', label: messages.navSkills },
  { href: '#projects', label: messages.navProjects },
  { href: '#contact', label: messages.navContact }
] as const;
---

<header
  class={css({
    position: 'sticky',
    top: 0,
    zIndex: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    width: '100%',
    maxWidth: 'sizes.wide',
    marginInline: 'auto',
    paddingInline: { base: '16px', sm: '24px', md: '32px' },
    paddingBlock: '12px',
    backgroundColor: 'bg.base/90',
    backdropFilter: 'blur(8px)'
  })}
>
  <a
    href="#hero"
    class={css({ color: 'primary', fontWeight: 700, fontSize: '1.125rem', textDecoration: 'none' })}
  >
    koralle
  </a>
  <nav
    aria-label={messages.navLabel}
    class={css({ display: 'flex', flexWrap: 'wrap', gap: '12px' })}
  >
    {
      links.map(link => (
        <a
          href={link.href}
          class={css({
            color: 'text.muted',
            textDecoration: 'none',
            fontSize: { base: '0.875rem', md: '1rem' },
            _hover: { color: 'text' }
          })}
        >
          {link.label}
        </a>
      ))
    }
  </nav>
  <nav aria-label={messages.languageSwitcherLabel} class={css({ display: 'flex', gap: '8px' })}>
    {
      Object.entries(localeLabels).map(([targetLocale, label]) => (
        <a
          href={pathForLocale(targetLocale as Locale)}
          aria-current={targetLocale === locale ? 'page' : undefined}
          class={css({
            color: targetLocale === locale ? 'primary' : 'text.muted',
            textDecoration: 'underline',
            textUnderlineOffset: '0.2em',
            fontSize: '0.875rem'
          })}
        >
          {label}
        </a>
      ))
    }
  </nav>
</header>
```

Panda で `bg.base/90` が使えない場合は `backgroundColor: 'bg.base'` に落とす。

- [x] **Step 2: Layout にスキップリンクと SiteHeader を入れる**

`Layout.astro` の Props に `messages` を追加し、body 先頭を次の順にする:

1. スキップリンク（`href="#main-content"`、視覚的に隠すが `:focus` で表示）
2. `<Loader />`
3. `<SiteHeader locale={locale} messages={messages} />`
4. `<main id="main-content"><slot /></main>`

スキップリンク例:

```astro
<a
  href="#main-content"
  class={css({
    position: 'absolute',
    left: '16px',
    top: '16px',
    zIndex: 10000,
    transform: 'translateY(-200%)',
    backgroundColor: 'bg.raised',
    color: 'text',
    paddingInline: '12px',
    paddingBlock: '8px',
    _focus: { transform: 'translateY(0)' }
  })}
>
  {messages.skipToContent}
</a>
```

- [x] **Step 3: 両ページから `messages` を Layout に渡す**

`src/pages/index.astro` と `src/pages/[...locale]/index.astro` の `<Layout ...>` に `messages={messages}` を追加する。

- [x] **Step 4: 型チェック**

Run:

```sh
pnpm typecheck
```

Expected: exit `0`

- [x] **Step 5: Commit**

```bash
git add src/components/SiteHeader src/layouts/Layout.astro src/pages/index.astro src/pages/[...locale]/index.astro
git commit -m "feat: add skip link and sticky site header"
```

---

### Task 4: Hero をブランド先行フルブリードへ

**Files:**

- Modify: `src/components/Hero/Hero.astro`

**Interfaces:**

- Consumes: `messages.heroName`, `messages.heroLead`, `messages.heroSupporting`, `messages.ctaProjects`, `messages.ctaContact`
- Produces: `#hero` セクション。ブランド名が最大の視覚信号。CTA は `#projects` / `#contact`

- [ ] **Step 1: Hero マークアップを再構成する**

要件を満たす構造:

- 外枠: `id="hero"`, `minHeight: 100svb`, `backgroundColor: 'bg.base'`, 薄いピンク放射（`backgroundImage` で radial-gradient）
- ブランド: `messages.heroName`（`koralle`）を最大フォント（例: `clamp(2.5rem, 8svi, 6rem)`）、`color: 'primary'`
- リード: `messages.heroLead`
- 補足: `messages.heroSupporting`（`color: 'text.muted'`）
- CTA: `<a href="#projects">`（主: `backgroundColor: 'primary'`, `color: 'bg.base'`）と `<a href="#contact">`（副: ボーダー）
- Mugicha: デスクトップでは右〜背景寄りで大きく。モバイルではコピーの下。装飾なので `alt=""`
- カード / バッジ / チップのオーバーレイは置かない
- 初期は既存どおり loader 完了まで `visibility: hidden` / `opacity: 0` でよいが、reduced-motion では後述どおり即時表示も可

主ボタンの文字色は `#1a1a1a`（`bg.base`）。`contrastRatio('#1a1a1a', '#ec93a1')` は primary-on-base と同じ比で AA を満たす。

- [ ] **Step 2: Hero スクリプトを reduced-motion 対応にする**

`Hero.astro` の script 内:

```ts
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const startHeroAnimation = () => {
  gsap.set('#hero', { visibility: 'visible', opacity: 1 });

  if (prefersReducedMotion) {
    return;
  }

  // 既存の SplitText / timeline を、順序 brand → lead → supporting/CTA → mugicha になるよう調整
};
```

Loader 完了イベント待ちは維持する。ただし reduced-motion 時は Loader 側（Task 5）が即座に完了イベントを飛ばす想定。

- [ ] **Step 3: 目視確認ポイントをメモしつつ typecheck**

Run:

```sh
pnpm typecheck
pnpm build
```

Expected: 両方 exit `0`

手動確認（`pnpm dev`）:

- ナビを除いても `koralle` が第一印象
- CTA で `#projects` / `#contact` へ移動できる
- モバイルで文字が画像に埋もれない

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero/Hero.astro
git commit -m "feat: redesign hero as brand-first full-bleed"
```

---

### Task 5: Loader の reduced-motion 対応

**Files:**

- Modify: `src/layouts/Layout.astro`（Loader 用 script）
- Modify: `src/components/Loader.astro`（色をトークン化できるなら）

**Interfaces:**

- Consumes: `loader-animation-finished` CustomEvent（既存）
- Produces: reduced-motion 時は短いフェードまたは即時非表示のあと、同じイベントを一度だけ dispatch

- [ ] **Step 1: Layout の Loader script を分岐する**

`DOMContentLoaded` ハンドラ先頭で:

```ts
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const loader = document.querySelector<HTMLElement>('#loader');
const loaderText = document.querySelector('#loader-text-inner');

if (!loader || !loaderText) return;

if (prefersReducedMotion) {
  loader.style.display = 'none';
  document.dispatchEvent(new CustomEvent('loader-animation-finished'));
  return;
}

// 既存の SplitText timeline を続行
```

- [ ] **Step 2: Loader 背景/文字色をトークンへ（任意だが推奨）**

`Loader.astro` の `#eeeeee` / `#1a1a1a` を、コントラストを保ったままトークンまたは明示 hex のままでもよい。変更するならライトなローダー面は維持（ブランドダークと対比）。無理にダーク化しない。

- [ ] **Step 3: typecheck**

Run:

```sh
pnpm typecheck
```

Expected: exit `0`

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Layout.astro src/components/Loader.astro
git commit -m "fix(a11y): honor reduced motion in loader"
```

---

### Task 6: Projects コレクションと一覧ロジック

**Files:**

- Modify: `src/content.config.ts`
- Create: `src/lib/projects.ts`
- Create: `tests/projects.test.ts`
- Create: `src/components/ProjectList/ProjectList.astro`
- Create: `src/components/ProjectList/index.ts`

**Interfaces:**

- Consumes: `Locale`
- Produces:
  - collection `projects` with zod schema below
  - `sortProjects<T extends { data: { order: number } }>(entries: T[]): T[]`
  - `filterProjectsByLocale<T extends { data: { locale: Locale } }>(entries: T[], locale: Locale): T[]`
  - `<ProjectList projects messages />`

- [ ] **Step 1: 失敗する projects ヘルパーテストを書く**

`tests/projects.test.ts`:

```ts
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
```

- [ ] **Step 2: 失敗を確認する**

Run:

```sh
node --experimental-strip-types --test tests/projects.test.ts
```

Expected: FAIL

- [ ] **Step 3: ヘルパーを実装する**

`src/lib/projects.ts`:

```ts
import type { Locale } from '../i18n/config';

export const filterProjectsByLocale = <T extends { data: { locale: Locale } }>(
  entries: T[],
  locale: Locale
) => entries.filter(entry => entry.data.locale === locale);

export const sortProjects = <T extends { data: { order: number } }>(entries: T[]) =>
  [...entries].sort((a, b) => a.data.order - b.data.order);
```

- [ ] **Step 4: テストを通す**

Run:

```sh
node --experimental-strip-types --test tests/projects.test.ts
```

Expected: PASS

- [ ] **Step 5: content collection を追加する**

`src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { locales } from './i18n/config';

const home = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/home' }),
  schema: z.object({
    locale: z.enum(locales),
    section: z.enum(['about', 'skills', 'projects', 'contact']),
    title: z.string(),
    order: z.number().int().nonnegative(),
    tone: z.enum(['dark', 'darker']).default('dark')
  })
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    locale: z.enum(locales),
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    links: z.array(
      z.object({
        label: z.string(),
        href: z.string().url()
      })
    ),
    order: z.number().int().nonnegative(),
    image: z.string().optional()
  })
});

export const collections = { home, projects };
```

- [ ] **Step 6: 空ディレクトリを用意する（ダミー項目は作らない）**

```bash
mkdir -p src/content/projects
touch src/content/projects/.gitkeep
```

- [ ] **Step 7: ProjectList コンポーネントを作る**

`src/components/ProjectList/index.ts`:

```ts
export { default as ProjectList } from './ProjectList.astro';
```

`ProjectList.astro` 要件:

- Props: `projects: CollectionEntry<'projects'>[]`, `messages: ReturnType<typeof getUi>`
- `projects.length === 0` なら `<p>{messages.projectsEmpty}</p>`
- それ以外は order 済み前提で行リスト。各行: title（リンク可）、summary、tags、links
- 装飾カードグリッドにしない。行はリンクがあるインタラクション容器としてボーダー区切り程度

- [ ] **Step 8: typecheck**

Run:

```sh
pnpm typecheck
```

Expected: exit `0`

- [ ] **Step 9: Commit**

```bash
git add src/content.config.ts src/lib/projects.ts tests/projects.test.ts src/components/ProjectList src/content/projects/.gitkeep
git commit -m "feat: add projects collection and empty-state list"
```

---

### Task 7: ContentSection の洗練と Projects 差し込み

**Files:**

- Modify: `src/components/ContentSection/ContentSection.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/[...locale]/index.astro`
- Modify: `src/content/home/en.projects.mdx`
- Modify: `src/content/home/ja.projects.mdx`

**Interfaces:**

- Consumes: `CollectionEntry<'home'>`, optional `projects: CollectionEntry<'projects'>[]`, `messages`
- Produces: セクション描画。`section === 'projects'` のとき MDX リードの下に `<ProjectList />`

- [ ] **Step 1: ページで projects を取得して渡す**

両ページで:

```ts
import { filterProjectsByLocale, sortProjects } from '../lib/projects'; // locale ページはパス深さに合わせる

const projectEntries = sortProjects(
  filterProjectsByLocale(await getCollection('projects'), locale)
);
```

`ContentSection` 呼び出し:

```astro
<ContentSection entry={entry} projects={projectEntries} messages={messages} />
```

- [ ] **Step 2: ContentSection を更新する**

- `backgroundColor`: `tone === 'darker' ? 'bg.base' : 'bg.raised'`
- 見出し色: `primary`、本文: `text.muted`
- `maxWidth: 'sizes.content'`（projects のリスト部分は同幅でよい）
- `entry.data.section === 'projects'` のとき `<Content />` の後に `<ProjectList projects={projects} messages={messages} />`
- セクション見出しに `data-section-heading` を付与（Task 8 の scroll reveal 用）
- MDX 内の `h2` と page の重複が見づらい場合、MDX 側の `##` を残しつつスタイルのみ整える（構造破壊しない）

- [ ] **Step 3: projects MDX をリード専用に整える**

`en.projects.mdx` 本文例:

```mdx
## Projects

Selected work will appear here as structured case rows.
```

`ja.projects.mdx` 本文例:

```mdx
## Projects

取り組んだ仕事を、構造化したケース行として掲載していきます。
```

（空コレクション時は ProjectList が「準備中」を追加表示する）

- [ ] **Step 4: build**

Run:

```sh
pnpm build
```

Expected: exit `0`。`/projects` セクションに準備中コピーが出る。

- [ ] **Step 5: Commit**

```bash
git add src/components/ContentSection/ContentSection.astro src/pages/index.astro src/pages/[...locale]/index.astro src/content/home/en.projects.mdx src/content/home/ja.projects.mdx
git commit -m "feat: wire projects list into content sections"
```

---

### Task 8: セクション見出しのスクロール入場

**Files:**

- Modify: `src/layouts/Layout.astro` または `src/components/ContentSection/ContentSection.astro` 内 script

**Interfaces:**

- Consumes: `[data-section-heading]`
- Produces: ScrollTrigger による控えめな fade/slide。reduced-motion では何もしない（要素は最初から可視）

- [ ] **Step 1: 見出し reveal script を追加する**

GSAP ScrollTrigger を登録し:

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const headings = document.querySelectorAll('[data-section-heading]');

if (!prefersReducedMotion) {
  headings.forEach(heading => {
    gsap.from(heading, {
      opacity: 0,
      y: 16,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 85%',
        once: true
      }
    });
  });
}
```

初期状態で `opacity: 0` を CSS に固定しない（JS 無効・reduced-motion で消えるのを防ぐ）。`gsap.from` のみ使う。

- [ ] **Step 2: typecheck / build**

Run:

```sh
pnpm typecheck
pnpm build
```

Expected: exit `0`

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro src/components/ContentSection/ContentSection.astro
git commit -m "feat: add reduced-motion-safe section heading reveals"
```

---

### Task 9: About / Skills / Contact コピー整理と Footer 修正

**Files:**

- Modify: `src/content/home/en.about.mdx`, `ja.about.mdx`
- Modify: `src/content/home/en.skills.mdx`, `ja.skills.mdx`
- Modify: `src/content/home/en.contact.mdx`, `ja.contact.mdx`
- Modify: `src/components/Footer/Footer.astro`

**Interfaces:**

- Consumes: 既存 Footer props
- Produces: グループ化された Skills、短い About、高さ自動の Footer、`id="footer"`

- [ ] **Step 1: Skills をグループリストにする**

`en.skills.mdx` 例:

```mdx
## Skills

Front-end craft I use to ship clear, durable interfaces.

### Front-end

- Astro, TypeScript, modern CSS

### Accessibility & UX

- Keyboard flows, contrast-aware UI, motion that respects preferences

### Delivery

- Static-first pages, content collections, low-ops hosting
```

`ja.skills.mdx` も同構造で日本語化。カードは使わない。

- [ ] **Step 2: About からスタック羅列を除く**

価値観・スタンスの短文のみ残す（現行 en/ja をベースに 1〜2 段落）。

- [ ] **Step 3: Contact リードを短く保つ**

呼びかけ 1 段落。実リンクは Footer / ヘッダー言語切替と重複してよい。

- [ ] **Step 4: Footer を修正する**

- `id="#footer"` → `id="footer"`
- `height: '100svb'` を削除し、`paddingBlock` で十分な余白にする（`minHeight` も必須ではない）
- 色を `bg.raised` / `primary` / `text.muted` トークンへ
- 言語切替は残す（ヘッダーと重複可）

- [ ] **Step 5: テストと品質ゲート**

Run:

```sh
node --experimental-strip-types --test tests/*.test.ts
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

Expected: すべて成功

- [ ] **Step 6: Commit**

```bash
git add src/content/home src/components/Footer/Footer.astro
git commit -m "content: refine section copy and fix footer layout"
```

---

### Task 10: 最終検証と仕様照合

**Files:**

- 変更なし（検証のみ）。問題があれば該当 Task に戻って修正コミット

- [ ] **Step 1: 全テスト再実行**

```sh
node --experimental-strip-types --test tests/*.test.ts
pnpm lint
pnpm format
pnpm typecheck
pnpm build
```

Expected: すべて成功

- [ ] **Step 2: 仕様チェックリストを確認する**

| 仕様項目          | 確認方法                                          |
| ----------------- | ------------------------------------------------- |
| ブランド先行 Hero | `/` で `koralle` が最大信号、Mugicha ドミナント   |
| 証明導線          | ヘッダーから About/Skills/Projects/Contact に到達 |
| Projects 空状態   | ダミー無しで準備中コピー                          |
| AA コントラスト   | `tests/contrast.test.ts` PASS                     |
| reduced-motion    | OS 設定または DevTools で Loader/Hero が壊れない  |
| Footer id         | DOM に `id="footer"`                              |
| スタブ非接触      | `git diff` で `About.astro` 等が変わっていない    |

- [ ] **Step 3: 必要ならフォーマット差分を commit**

```bash
git add -A
git commit -m "chore: format after portfolio design refinement"
```

（差分がなければ commit しない）

---

## Self-Review

1. **Spec coverage:** Hero フルブリード、ナビ、スキップリンク、トークン、reduced-motion、Projects コレクション分離、空状態、Skills グループ、Footer 修正、見出し reveal を各 Task に割り当て済み。`primary.accessible` は実測 AA 合格のため不要と明記。
2. **Placeholder scan:** TBD / “similar to Task N” なし。テストコマンドと期待結果を具体化。
3. **Type consistency:** `filterProjectsByLocale` / `sortProjects` / `messages.*` キー名を Task 間で統一。
