import { cva } from '../../../styled-system/css';

export interface LocaleLink {
  href: string;
  label: string;
  current?: boolean;
}

export interface LocaleSwitcherProps {
  label: string;
  locales: readonly LocaleLink[];
  density?: 'compact' | 'roomy';
}

const nav = cva({
  base: {
    display: 'flex'
  },
  variants: {
    density: {
      compact: { gap: '8px' },
      roomy: { gap: '12px' }
    }
  },
  defaultVariants: {
    density: 'roomy'
  }
});

const localeLink = cva({
  base: {
    textDecoration: 'underline',
    textUnderlineOffset: '0.2em',
    color: 'text.muted'
  },
  variants: {
    current: {
      true: { color: 'primary' }
    },
    density: {
      compact: { fontSize: '0.875rem' }
    }
  }
});

export function LocaleSwitcher({ label, locales, density = 'roomy' }: LocaleSwitcherProps) {
  return (
    <nav aria-label={label} class={nav({ density })}>
      {locales.map(locale => (
        <a
          key={locale.href}
          href={locale.href}
          aria-current={locale.current ? 'page' : undefined}
          class={localeLink({
            current: locale.current,
            density: density === 'compact' ? 'compact' : undefined
          })}
        >
          {locale.label}
        </a>
      ))}
    </nav>
  );
}
