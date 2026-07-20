import { css } from '../../../styled-system/css';
import type { LocaleLink } from '../SiteHeader';

export interface FooterProps {
  languageSwitcherLabel: string;
  copyright: string;
  locales: readonly LocaleLink[];
}

export function Footer({ languageSwitcherLabel, copyright, locales }: FooterProps) {
  return (
    <footer
      id="footer"
      class={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        width: '100svi',
        backgroundColor: 'bg.raised',
        paddingInline: { base: '16px', sm: '24px', md: '32px' },
        paddingBlock: { base: '32px', md: '40px' }
      })}
    >
      <nav aria-label={languageSwitcherLabel} class={css({ display: 'flex', gap: '12px' })}>
        {locales.map(locale => (
          <a
            key={locale.href}
            href={locale.href}
            aria-current={locale.current ? 'page' : undefined}
            class={css({
              color: locale.current ? 'primary' : 'text.muted',
              textDecoration: 'underline',
              textUnderlineOffset: '0.2em'
            })}
          >
            {locale.label}
          </a>
        ))}
      </nav>
      <p
        class={css({
          margin: 0,
          fontSize: { base: '0.75em', md: '0.875em' },
          color: 'text.muted'
        })}
      >
        {copyright}
      </p>
    </footer>
  );
}
