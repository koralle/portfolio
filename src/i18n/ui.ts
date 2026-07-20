import type { Locale } from './config';

export const ui = {
  en: {
    siteTitle: "koralle's Portfolio",
    description:
      'White seal, frontend engineer. Surfing the endless waves of evolving web technologies and design trends, always swimming forward with curiosity.',
    heroGreetingPrefix: "Hi! I'm",
    heroName: 'koralle',
    heroGreetingSuffix: '!',
    heroLead: 'A seal and a front-end developer.',
    heroSupporting: 'Accessible UI, playful interaction, lasting front-end craft.',
    contactLead: 'Feel free to contact me.',
    copyright: '© Copyright 2025, koralle. All Rights Reserved.',
    languageSwitcherLabel: 'Language',
    navLabel: 'Primary',
    skipToContent: 'Skip to content',
    navAbout: 'About',
    navSkills: 'Skills',
    navProjects: 'Projects',
    navContact: 'Contact',
    ctaProjects: 'See projects',
    ctaContact: 'Contact',
    projectsEmpty: 'Coming soon — project write-ups are being prepared.'
  },
  ja: {
    siteTitle: "koralle's Portfolio",
    description:
      'White seal, frontend engineer. Surfing the endless waves of evolving web technologies and design trends, always swimming forward with curiosity.',
    heroGreetingPrefix: "Hi! I'm",
    heroName: 'koralle',
    heroGreetingSuffix: '!',
    heroLead: 'A seal and a front-end developer.',
    heroSupporting: 'アクセシブルなUI、遊び心のあるインタラクション、長く育てるフロントエンド。',
    contactLead: 'Feel free to contact me.',
    copyright: '© Copyright 2025, koralle. All Rights Reserved.',
    languageSwitcherLabel: '言語',
    navLabel: '主要',
    skipToContent: '本文へスキップ',
    navAbout: 'About',
    navSkills: 'Skills',
    navProjects: 'Projects',
    navContact: 'Contact',
    ctaProjects: 'Projects を見る',
    ctaContact: 'Contact',
    projectsEmpty: '準備中 — プロジェクト紹介を整えています。'
  }
} satisfies Record<Locale, Record<string, string>>;

export const getUi = (locale: Locale) => ui[locale];
