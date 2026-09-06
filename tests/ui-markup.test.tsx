import assert from 'node:assert/strict';
import test from 'node:test';
import type { VNode } from 'preact';
import { render } from 'preact-render-to-string';
import { SkipLink } from '../src/ui/SkipLink/SkipLink.tsx';
import { Loader } from '../src/ui/Loader/Loader.tsx';
import { SiteHeader } from '../src/ui/SiteHeader/SiteHeader.tsx';
import { Footer } from '../src/ui/Footer/Footer.tsx';
import { Hero } from '../src/ui/Hero/Hero.tsx';
import { ContactLinks } from '../src/ui/ContactLinks/ContactLinks.tsx';
import { ProjectList } from '../src/ui/ProjectList/ProjectList.tsx';
import { ContentSection } from '../src/ui/ContentSection/ContentSection.tsx';
import { SectionHeading } from '../src/ui/ContentSection/SectionHeading.tsx';

const semanticHtml = (node: VNode) => render(node).replace(/ class="[^"]*"/g, '');

const locales = [
  { href: '/', label: 'English', current: true },
  { href: '/ja/', label: '日本語' }
] as const;

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' }
] as const;

void test('SkipLink points at main content', () => {
  assert.equal(
    semanticHtml(<SkipLink>Skip to content</SkipLink>),
    '<a href="#main-content">Skip to content</a>'
  );
});

void test('Loader keeps the GSAP hook ids and loading copy', () => {
  assert.equal(
    semanticHtml(<Loader />),
    '<div id="loader" role="status" aria-busy="true"><p><span id="loader-text-inner"><span> Now </span><span> Loading... </span></span></p></div>'
  );
});

void test('SiteHeader exposes brand, primary nav, and locale switcher', () => {
  assert.equal(
    semanticHtml(
      <SiteHeader
        navLabel="Primary"
        languageSwitcherLabel="Language"
        links={navLinks}
        locales={locales}
      />
    ),
    '<header><a href="#hero">koralle</a><nav aria-label="Primary"><a href="#about">About</a><a href="#skills">Skills</a></nav><nav aria-label="Language"><a href="/" aria-current="page">English</a><a href="/ja/">日本語</a></nav></header>'
  );
});

void test('Footer exposes locale switcher and copyright', () => {
  assert.equal(
    semanticHtml(
      <Footer
        languageSwitcherLabel="Language"
        copyright="© Copyright 2025, koralle. All Rights Reserved."
        locales={locales}
      />
    ),
    '<footer id="footer"><nav aria-label="Language"><a href="/" aria-current="page">English</a><a href="/ja/">日本語</a></nav><p>© Copyright 2025, koralle. All Rights Reserved.</p></footer>'
  );
});

void test('Hero keeps landmark ids, default CTA hrefs, and the illustration slot', () => {
  assert.equal(
    semanticHtml(
      <Hero
        brand="koralle"
        lead="lead"
        supporting="supporting"
        ctaProjectsLabel="See projects"
        ctaContactLabel="Contact"
      >
        <img src="/x.webp" alt="" />
      </Hero>
    ),
    '<section id="hero"><div><h1 id="hero-brand">koralle</h1><p id="hero-lead">lead</p><p id="hero-supporting">supporting</p><div id="hero-ctas"><a href="#projects">See projects</a><a href="#contact">Contact</a></div></div><div id="sleeping-mugicha"><img src="/x.webp" alt/></div></section>'
  );
});

void test('ContactLinks open in a new tab with lazy decorative icons', () => {
  assert.equal(
    semanticHtml(
      <ContactLinks
        links={[
          {
            href: 'https://github.com/koralle',
            label: 'GitHub',
            iconSrc: '/images/github-mark-white.webp'
          }
        ]}
      />
    ),
    '<nav aria-label="Social"><a href="https://github.com/koralle" target="_blank" rel="noopener noreferrer"><img src="/images/github-mark-white.webp" alt width="20" height="20" decoding="async" loading="lazy"/>GitHub</a></nav>'
  );
});

void test('ProjectList empty state is a paragraph', () => {
  assert.equal(
    semanticHtml(<ProjectList projects={[]} emptyMessage="Coming soon" />),
    '<p>Coming soon</p>'
  );
});

void test('ProjectList renders title, summary, tags, and links', () => {
  assert.equal(
    semanticHtml(
      <ProjectList
        projects={[
          {
            title: 'P',
            summary: 'S',
            tags: ['t'],
            links: [{ label: 'Repo', href: 'https://example.com' }]
          }
        ]}
        emptyMessage="empty"
      />
    ),
    '<ul><li><h3><a href="https://example.com">P</a></h3><p>S</p><ul><li>t</li></ul><ul><li><a href="https://example.com">Repo</a></li></ul></li></ul>'
  );
});

void test('ContentSection wraps a heading mapped for GSAP', () => {
  assert.equal(
    semanticHtml(
      <ContentSection id="about">
        <SectionHeading>About</SectionHeading>
        <p>Hi</p>
      </ContentSection>
    ),
    '<section id="about"><article><h2 data-section-heading="true">About</h2><p>Hi</p></article></section>'
  );
});
