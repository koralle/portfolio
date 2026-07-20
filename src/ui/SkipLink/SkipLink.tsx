import type { ComponentChildren } from 'preact';
import { css } from '../../../styled-system/css';

export interface SkipLinkProps {
  href?: string;
  children: ComponentChildren;
}

export function SkipLink({ href = '#main-content', children }: SkipLinkProps) {
  return (
    <a
      href={href}
      class={css({
        position: 'absolute',
        left: '16px',
        top: '16px',
        zIndex: 10000,
        transform: 'translateY(-200%)',
        backgroundColor: 'bg.raised',
        color: 'text',
        paddingInline: '12px',
        paddingBlock: '8px',
        _focus: { transform: 'translateY(0)' }
      })}
    >
      {children}
    </a>
  );
}
