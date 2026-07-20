import type { Locale } from '../i18n/config';

export const filterProjectsByLocale = <T extends { data: { locale: Locale } }>(
  entries: T[],
  locale: Locale
) => entries.filter(entry => entry.data.locale === locale);

export const sortProjects = <T extends { data: { order: number } }>(entries: T[]) =>
  [...entries].sort((a, b) => a.data.order - b.data.order);
