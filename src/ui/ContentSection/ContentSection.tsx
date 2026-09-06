import type { ComponentChildren } from 'preact';
import { css, cva } from '../../../styled-system/css';

export interface ContentSectionProps {
  id: string;
  tone?: 'base' | 'raised' | 'darker';
  children: ComponentChildren;
}

const section = cva({
  base: {
    display: 'grid',
    placeItems: 'center',
    width: '100svi',
    minHeight: '100svb',
    paddingInline: { base: '16px', sm: '24px', md: '32px' },
    paddingBlock: '64px',
    contentVisibility: 'auto',
    containIntrinsicSize: 'auto none auto 100svb'
  },
  variants: {
    tone: {
      base: { backgroundColor: 'bg.base' },
      raised: { backgroundColor: 'bg.raised' },
      darker: { backgroundColor: 'bg.base' }
    }
  },
  defaultVariants: {
    tone: 'raised'
  }
});

const article = css({
  display: 'flex',
  flexDir: 'column',
  gap: '24px',
  width: '100%',
  maxWidth: 'sizes.content',
  '& h2': { color: 'primary', fontSize: { base: '2em', md: '3em' }, fontWeight: 700 },
  '& h3': {
    color: 'text.muted',
    fontSize: { base: '1.25em', md: '1.5em' },
    fontWeight: 700
  },
  '& p, & li': {
    color: 'text.muted',
    lineHeight: 1.8,
    fontSize: { base: '1em', md: '1.125em' }
  },
  '& ul': { display: 'grid', gap: '12px', paddingInlineStart: '1.25em' },
  '& a': { color: 'primary', textDecoration: 'underline', textUnderlineOffset: '0.2em' }
});

export function ContentSection({ id, tone = 'raised', children }: ContentSectionProps) {
  return (
    <section id={id} class={section({ tone })}>
      <article class={article}>{children}</article>
    </section>
  );
}
