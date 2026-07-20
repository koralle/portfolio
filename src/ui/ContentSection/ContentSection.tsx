import type { ComponentChildren } from 'preact';
import { css } from '../../../styled-system/css';

export interface ContentSectionProps {
  id: string;
  tone?: 'base' | 'raised' | 'darker';
  children: ComponentChildren;
}

export function ContentSection({ id, tone = 'raised', children }: ContentSectionProps) {
  return (
    <section
      id={id}
      class={css({
        display: 'grid',
        placeItems: 'center',
        width: '100svi',
        minHeight: '100svb',
        backgroundColor: tone === 'darker' || tone === 'base' ? 'bg.base' : 'bg.raised',
        paddingInline: { base: '16px', sm: '24px', md: '32px' },
        paddingBlock: '64px'
      })}
    >
      <article
        class={css({
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
        })}
      >
        {children}
      </article>
    </section>
  );
}
