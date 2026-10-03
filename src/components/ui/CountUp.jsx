import { animate, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { usePrefersReducedMotion } from '../../hooks/useEnv';

/** Eased output for tweening numbers — fast start, long settle. */
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function format(value, { decimals = 0, prefix = '', suffix = '' }) {
  return `${prefix}${value.toFixed(decimals)}${suffix}`;
}

/**
 * Counts up to `value` the first time it scrolls into view.
 *
 * Returns the formatted string so the caller can drop it straight into markup.
 * Honours reduced motion by rendering the final value immediately.
 */
export default function CountUp({ value, decimals = 0, prefix = '', suffix = '', duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(() => format(0, { decimals, prefix, suffix }));

  useEffect(() => {
    // `animate()` is imperative, so MotionConfig cannot switch it off for us —
    // reduced motion has to be short-circuited here or the numbers still count.
    if (!inView || reducedMotion) return undefined;

    const controls = animate(0, value, {
      duration,
      ease: easeOutExpo,
      onUpdate: (latest) => setDisplay(format(latest, { decimals, prefix, suffix }))
    });

    return () => controls.stop();
  }, [inView, value, decimals, prefix, suffix, duration, reducedMotion]);

  // Nothing is stored for the reduced-motion path: render the real number and
  // skip the tween entirely.
  const text = reducedMotion ? format(value, { decimals, prefix, suffix }) : display;

  return (
    <span ref={ref} className="count-up">
      {text}
    </span>
  );
}