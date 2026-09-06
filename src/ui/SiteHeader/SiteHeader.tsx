import { css } from '../../../styled-system/css';
import { LocaleSwitcher, type LocaleLink } from '../LocaleSwitcher';

export type { LocaleLink };

export interface NavLink {
  href: string;
  label: string;
}

export interface SiteHeaderProps {
  brandHref?: string;
  brandLabel?: string;
  navLabel: string;
  languageSwitcherLabel: string;
  links: readonly NavLink[];
  locales: readonly LocaleLink[];
}

const header = css({
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
});

const brand = css({
  color: 'primary',
  fontWeight: 700,
  fontSize: '1.125rem',
  textDecoration: 'none'
});

const primaryNav = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px'
});

const navLink = css({
  color: 'text.muted',
  textDecoration: 'none',
  fontSize: { base: '0.875rem', md: '1rem' },
  _hover: { color: 'text' }
});

export function SiteHeader({
  brandHref = '#hero',
  brandLabel = 'koralle',
  navLabel,
  languageSwitcherLabel,
  links,
  locales
}: SiteHeaderProps) {
  return (
    <header class={header}>
      <a href={brandHref} class={brand}>
        {brandLabel}
      </a>
      <nav aria-label={navLabel} class={primaryNav}>
        {links.map(link => (
          <a key={link.href} href={link.href} class={navLink}>
            {link.label}
          </a>
        ))}
      </nav>
      <LocaleSwitcher label={languageSwitcherLabel} locales={locales} density="compact" />
    </header>
  );
}
