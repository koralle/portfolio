import { css } from '../../../styled-system/css';

export interface NavLink {
  href: string;
  label: string;
}

export interface LocaleLink {
  href: string;
  label: string;
  current?: boolean;
}

export interface SiteHeaderProps {
  brandHref?: string;
  brandLabel?: string;
  navLabel: string;
  languageSwitcherLabel: string;
  links: readonly NavLink[];
  locales: readonly LocaleLink[];
}

export function SiteHeader({
  brandHref = '#hero',
  brandLabel = 'koralle',
  navLabel,
  languageSwitcherLabel,
  links,
  locales
}: SiteHeaderProps) {
  return (
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
        href={brandHref}
        class={css({
          color: 'primary',
          fontWeight: 700,
          fontSize: '1.125rem',
          textDecoration: 'none'
        })}
      >
        {brandLabel}
      </a>
      <nav aria-label={navLabel} class={css({ display: 'flex', flexWrap: 'wrap', gap: '12px' })}>
        {links.map(link => (
          <a
            key={link.href}
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
        ))}
      </nav>
      <nav aria-label={languageSwitcherLabel} class={css({ display: 'flex', gap: '8px' })}>
        {locales.map(locale => (
          <a
            key={locale.href}
            href={locale.href}
            aria-current={locale.current ? 'page' : undefined}
            class={css({
              color: locale.current ? 'primary' : 'text.muted',
              textDecoration: 'underline',
              textUnderlineOffset: '0.2em',
              fontSize: '0.875rem'
            })}
          >
            {locale.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
