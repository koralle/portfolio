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

const nav = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  marginBlockStart: '8px'
});

const link = css({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  fontWeight: 700,
  color: 'text.muted',
  textDecoration: 'none',
  _hover: { color: 'primary' }
});

export function ContactLinks({ ariaLabel = 'Social', links }: ContactLinksProps) {
  return (
    <nav aria-label={ariaLabel} class={nav}>
      {links.map(item => (
        <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" class={link}>
          <img
            src={item.iconSrc}
            alt={item.iconAlt ?? ''}
            width={item.iconWidth ?? 20}
            height={item.iconHeight ?? 20}
            decoding="async"
            loading="lazy"
          />
          {item.label}
        </a>
      ))}
    </nav>
  );
}
