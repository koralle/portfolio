import { css } from '../../../styled-system/css';

export interface PlaceholderSectionProps {
  title: string;
  backgroundColor?: string;
}

export function PlaceholderSection({
  title,
  backgroundColor = '#212121'
}: PlaceholderSectionProps) {
  return (
    <section
      class={css({
        display: 'grid',
        placeItems: 'center',
        width: '100svi',
        height: '100svb',
        backgroundColor,
        paddingInline: { base: '16px', sm: '24px', md: '32px' },
        paddingBlock: '64px'
      })}
    >
      <h1
        class={css({
          display: 'inline flex',
          justifyContent: 'start',
          alignItems: 'center',
          color: 'primary'
        })}
      >
        {title}
      </h1>
    </section>
  );
}
