import { css } from '../../../styled-system/css';

const overlay = css({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100svb',
  display: 'grid',
  placeItems: 'center',
  backgroundColor: '#eeeeee',
  zIndex: 9999
});

const message = css({
  margin: 0,
  fontSize: '3rem',
  fontWeight: 700,
  color: 'bg.base',
  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
});

const inner = css({
  display: 'flex',
  gap: '0.25em'
});

export function Loader() {
  return (
    <div id="loader" role="status" aria-busy="true" class={overlay}>
      <p class={message}>
        <span id="loader-text-inner" class={inner}>
          <span> Now </span>
          <span> Loading... </span>
        </span>
      </p>
    </div>
  );
}
