export const locales = ['en', 'ja'] as const;
export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

export const localeLabels = {
  en: 'English',
  ja: '日本語'
} satisfies Record<Locale, string>;

export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);

export const normalizeLocale = (locale: string | undefined): Locale => {
  if (!locale) return defaultLocale;
  return isLocale(locale) ? locale : defaultLocale;
};

export const pathForLocale = (locale: Locale) => (locale === defaultLocale ? '/' : `/${locale}/`);
