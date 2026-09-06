import { css } from '../../../styled-system/css';
import { LocaleSwitcher, type LocaleLink } from '../LocaleSwitcher';

export interface FooterProps {
  languageSwitcherLabel: string;
  copyright: string;
  locales: readonly LocaleLink[];
}

const footer = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  width: '100svi',
  backgroundColor: 'bg.raised',
  paddingInline: { base: '16px', sm: '24px', md: '32px' },
  paddingBlock: { base: '32px', md: '40px' }
});

const copyrightText = css({
  margin: 0,
  fontSize: { base: '0.75em', md: '0.875em' },
  color: 'text.muted'
});

export function Footer({ languageSwitcherLabel, copyright, locales }: FooterProps) {
  return (
    <footer id="footer" class={footer}>
      <LocaleSwitcher label={languageSwitcherLabel} locales={locales} density="roomy" />
      <p class={copyrightText}>{copyright}</p>
    </footer>
  );
}
