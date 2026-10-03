import { AnimatePresence, m } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

import { usePrefersReducedMotion } from '../../hooks/useEnv';
import { ease, spring } from '../../lib/motion';
import './Preloader.css';

const SEEN_KEY = 'mb-preloader-seen';
const LIFT_AT = 820; // ms — start sliding the curtain
const DONE_AT = 1150; // ms — hard ceiling, comfortably under the 1.2s budget

/** sessionStorage is unavailable in some privacy modes; never let it throw. */
function hasSeenPreloader() {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return true; // assume seen rather than risk a stuck curtain
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* no-op */
  }
}

/**
 * One-shot intro curtain.
 *
 * Shown at most once per session, and never at all under reduced motion.
 * It is purely decorative and sits above content that is always in the DOM, so
 * crawlers and no-JS readers are unaffected — `onDone` is guaranteed to fire on
 * every path so the hero shader can never be left unmounted.
 */
export default function Preloader({ onDone }) {
  const reduced = usePrefersReducedMotion();

  const [seen] = useState(hasSeenPreloader);
  const [phase, setPhase] = useState(seen ? 'idle' : 'in');

  const finish = useCallback(() => {
    markSeen();
    setPhase('idle');
    onDone();
  }, [onDone]);

  useEffect(() => {
    if (seen || reduced) {
      // Skip path. rAF keeps the parent's state update out of the effect body.
      const raf = requestAnimationFrame(finish);
      return () => cancelAnimationFrame(raf);
    }

    const timers = [
      setTimeout(() => setPhase('out'), LIFT_AT),
      setTimeout(finish, DONE_AT)
    ];
    return () => timers.forEach(clearTimeout);
  }, [seen, reduced, finish]);

  const visible = phase !== 'idle';

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          className="preloader"
          data-phase={phase}
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease }}
        >
          <m.span
            className="preloader__mark"
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring.snappy, delay: 0.08 }}
          >
            MB
            <m.span
              className="preloader__rule"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, ease, delay: 0.24 }}
            />
          </m.span>
        </m.div>
      )}
    </AnimatePresence>
  );
}