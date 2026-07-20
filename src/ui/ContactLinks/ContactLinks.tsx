import { css } from '../../../styled-system/css';

export interface ContactLinkItem {
  href: string;
  label: string;
  iconSrc: string;
  iconAlt?: string;
  iconWidth?: number;
  iconHeight?: number;
}

export interface ContactLinksProps {
  ariaLabel?: string;
  links: readonly ContactLinkItem[];
}

export function ContactLinks({ ariaLabel = 'Social', links }: ContactLinksProps) {
  return (
    <nav
      aria-label={ariaLabel}
      class={css({
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        marginBlockStart: '8px'
      })}
    >
      {links.map(link => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          class={css({
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            color: 'text.muted',
            textDecoration: 'none',
            _hover: { color: 'primary' }
          })}
        >
          <img
            src={link.iconSrc}
            alt={link.iconAlt ?? ''}
            width={link.iconWidth ?? 20}
            height={link.iconHeight ?? 20}
            decoding="async"
            loading="lazy"
          />
          {link.label}
        </a>
      ))}
    </nav>
  );
}
