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
    footerHeading: 'Feel free to contact me!',
    copyright: '© Copyright 2025, koralle. All Rights Reserved.',
    languageSwitcherLabel: 'Language'
  },
  ja: {
    siteTitle: "koralle's Portfolio",
    description:
      'White seal, frontend engineer. Surfing the endless waves of evolving web technologies and design trends, always swimming forward with curiosity.',
    heroGreetingPrefix: "Hi! I'm",
    heroName: 'koralle',
    heroGreetingSuffix: '!',
    heroLead: 'A seal and a front-end developer.',
    footerHeading: 'Feel free to contact me!',
    copyright: '© Copyright 2025, koralle. All Rights Reserved.',
    languageSwitcherLabel: '言語'
  }
} satisfies Record<Locale, Record<string, string>>;

export const getUi = (locale: Locale) => ui[locale];
