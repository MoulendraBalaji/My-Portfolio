import { m, useMotionValue, useSpring } from 'motion/react';
import { useRef } from 'react';

import { useFinePointer, usePrefersReducedMotion } from '../../hooks/useEnv';
import { spring } from '../../lib/motion';

/**
 * Cursor-following magnetic pull.
 *
 * Only the inner element translates — the outer wrapper stays put — so the
 * layout never shifts and the hit target stays exactly where it was painted.
 * Disabled entirely for coarse pointers and reduced motion.
 */
export default function Magnetic({ children, strength = 0.28, radius = 90, className = '', ...rest }) {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const innerRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring.snappy);
  const sy = useSpring(y, spring.snappy);

  function handleMove(event) {
    if (!enabled || !innerRef.current) return;
    const rect = innerRef.current.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);

    // Ease off with distance so the button never feels glued to the cursor.
    const distance = Math.hypot(dx, dy);
    if (distance > radius * 2.2) {
      x.set(0);
      y.set(0);
      return;
    }
    const falloff = Math.max(0, 1 - distance / (radius * 2.2));
    x.set(dx * strength * falloff);
    y.set(dy * strength * falloff);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.span
      className={`magnetic ${className}`.trim()}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...rest}
    >
      <m.span ref={innerRef} className="magnetic__inner" style={enabled ? { x: sx, y: sy } : undefined}>
        {children}
      </m.span>
    </m.span>
  );
}