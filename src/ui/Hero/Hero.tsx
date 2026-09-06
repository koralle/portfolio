import type { ComponentChildren } from 'preact';
import { css, cva } from '../../../styled-system/css';

export interface HeroProps {
  brand: string;
  lead: string;
  supporting: string;
  ctaProjectsLabel: string;
  ctaContactLabel: string;
  ctaProjectsHref?: string;
  ctaContactHref?: string;
  children?: ComponentChildren;
}

const root = css({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: { base: 'flex-start', md: 'center' },
  width: '100%',
  minHeight: '100svb',
  backgroundColor: 'bg.base',
  backgroundImage:
    'radial-gradient(ellipse 80% 60% at 75% 45%, rgba(236, 147, 161, 0.18), transparent 70%)',
  overflow: 'hidden',
  visibility: 'hidden',
  opacity: 0
});

const copy = css({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: { base: '16px', md: '20px' },
  width: '100%',
  maxWidth: { base: 'sizes.wide', md: 'min(40rem, 46svi)' },
  marginInline: 'auto',
  marginInlineStart: { md: 'max(32px, calc((100% - 1440px) / 2 + 32px))' },
  marginInlineEnd: { md: 'auto' },
  paddingInline: { base: '16px', sm: '24px', md: '32px' },
  paddingBlock: { base: '48px', md: '64px' },
  paddingBlockEnd: { base: '24px', md: '64px' }
});

const brandHeading = css({
  margin: 0,
  fontSize: 'clamp(2.5rem, 8svi, 6rem)',
  fontWeight: 700,
  lineHeight: 1.05,
  letterSpacing: '-0.02em',
  color: 'primary'
});

const leadText = css({
  margin: 0,
  fontSize: { base: '1.25rem', md: '1.5rem', lg: '1.75rem' },
  fontWeight: 500,
  lineHeight: 1.35,
  color: 'text'
});

const supportingText = css({
  margin: 0,
  fontSize: { base: '1rem', md: '1.125rem' },
  fontWeight: 400,
  lineHeight: 1.55,
  color: 'text.muted',
  maxWidth: '34rem'
});

const ctaRow = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  marginTop: { base: '8px', md: '12px' }
});

const cta = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingInline: '20px',
    paddingBlock: '12px',
    fontSize: '1rem',
    textDecoration: 'none',
    borderRadius: '4px'
  },
  variants: {
    visual: {
      solid: {
        backgroundColor: 'primary',
        color: 'bg.base',
        fontWeight: 700,
        border: '2px solid {colors.primary}',
        _hover: { filter: 'brightness(1.05)' }
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'text',
        fontWeight: 600,
        border: '2px solid {colors.text.muted}',
        _hover: { borderColor: 'primary', color: 'primary' }
      }
    }
  }
});

const illustration = css({
  pointerEvents: 'none',
  zIndex: 0,
  position: { base: 'relative', md: 'absolute' },
  insetBlock: { md: '0' },
  insetInlineEnd: { md: '0' },
  width: { base: '100%', md: '66svi' },
  minHeight: { base: '42svb', md: '100%' },
  marginTop: { base: 'auto', md: '0' },
  display: 'grid',
  placeItems: { base: 'end center', md: 'center end' },
  '& img': {
    width: '100%',
    height: { base: 'auto', md: '100%' },
    minHeight: { md: '100%' },
    objectFit: 'contain',
    objectPosition: { base: 'center bottom', md: 'right center' }
  }
});

export function Hero({
  brand,
  lead,
  supporting,
  ctaProjectsLabel,
  ctaContactLabel,
  ctaProjectsHref = '#projects',
  ctaContactHref = '#contact',
  children
}: HeroProps) {
  return (
    <section id="hero" class={root}>
      <div class={copy}>
        <h1 id="hero-brand" class={brandHeading}>
          {brand}
        </h1>
        <p id="hero-lead" class={leadText}>
          {lead}
        </p>
        <p id="hero-supporting" class={supportingText}>
          {supporting}
        </p>
        <div id="hero-ctas" class={ctaRow}>
          <a href={ctaProjectsHref} class={cta({ visual: 'solid' })}>
            {ctaProjectsLabel}
          </a>
          <a href={ctaContactHref} class={cta({ visual: 'outline' })}>
            {ctaContactLabel}
          </a>
        </div>
      </div>

      <div id="sleeping-mugicha" class={illustration}>
        {children}
      </div>
    </section>
  );
}
