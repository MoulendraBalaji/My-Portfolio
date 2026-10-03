import { m } from 'motion/react';
import { useRef } from 'react';

import { spring } from '../../lib/motion';

/**
 * Card with a hover lift, a brightening hairline, and a spotlight that tracks
 * the cursor.
 *
 * The spotlight position is written to `--mx` / `--my` as percentages and
 * consumed by a CSS radial gradient. Only a custom property changes per move —
 * no React re-render, and nothing that can trigger layout.
 */
export default function SpotlightCard({ className = '', children, ...rest }) {
  const ref = useRef(null);

  function handlePointerMove(event) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <m.div
      ref={ref}
      className={`spotlight ${className}`.trim()}
      onPointerMove={handlePointerMove}
      initial="rest"
      animate="rest"
      whileHover="hover"
      variants={{ rest: { y: 0 }, hover: { y: -6 } }}
      transition={spring.soft}
      {...rest}
    >
      <span className="spotlight__glow" aria-hidden="true" />
      {children}
    </m.div>
  );
}