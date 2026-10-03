import { m, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { useFinePointer, usePrefersReducedMotion } from '../../hooks/useEnv';
import './Cursor.css';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary, [data-cursor]';
/** Never suppress the native caret/text cursor here. */
const TEXT_ENTRY = 'input, textarea, [contenteditable="true"]';

/**
 * Lime dot with a trailing ring.
 *
 * Additive only — it never touches MicroSlats, which listens on `window`
 * independently. The native cursor is hidden only while this is active, and
 * explicitly restored over text fields.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const [visible, setVisible] = useState(false);
  const [hot, setHot] = useState(false);
  // Mirrors `visible` without re-running the effect — otherwise the first
  // pointermove would tear down and re-add the listeners and the
  // `has-custom-cursor` class, flickering the native cursor.
  const shownRef = useRef(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Dot tracks tightly, ring lags behind it.
  const dotX = useSpring(x, { stiffness: 700, damping: 40, mass: 0.35 });
  const dotY = useSpring(y, { stiffness: 700, damping: 40, mass: 0.35 });
  const ringX = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return undefined;

    document.documentElement.classList.add('has-custom-cursor');

    function reveal() {
      if (shownRef.current) return;
      shownRef.current = true;
      setVisible(true);
    }

    function handleMove(event) {
      x.set(event.clientX);
      y.set(event.clientY);
      reveal();

      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest(TEXT_ENTRY)) {
        setHot(false);
        return;
      }
      setHot(Boolean(target.closest(INTERACTIVE)));
    }

    function handleLeave() {
      shownRef.current = false;
      setVisible(false);
    }

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerleave', handleLeave);
    document.addEventListener('pointerenter', reveal);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerleave', handleLeave);
      document.removeEventListener('pointerenter', reveal);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div className="cursor" aria-hidden="true">
      <m.span className="cursor__ring" style={{ x: ringX, y: ringY }} data-visible={visible} data-hot={hot} />
      <m.span className="cursor__dot" style={{ x: dotX, y: dotY }} data-visible={visible} />
    </div>
  );
}