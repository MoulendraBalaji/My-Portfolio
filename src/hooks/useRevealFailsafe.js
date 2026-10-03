import { useEffect, useState } from 'react';

import { usePrefersReducedMotion } from './useEnv';

/**
 * Reveal-on-scroll that cannot leave content hidden.
 *
 * `whileInView` is the right tool for most of this site, but it has one bad
 * failure mode: if the trigger never fires — a zero-height target, content
 * already scrolled past on mount, an IntersectionObserver that never lands, or
 * animation blocked outright — the element keeps its `hidden` variant forever
 * and the content is simply *gone*. That is the "blank render" class of bug
 * this hook exists to rule out.
 *
 * So the reveal is belt-and-braces: a timer reveals the content regardless, and
 * the value it returns is also true the instant reduced motion is requested.
 *
 * - Reduced motion  -> true immediately, no animation at all.
 * - Timer fires    -> true, unconditionally. This is the failsafe.
 * - `enabled` false-> true again re-arms the timer from scratch.
 * - `enabled` false -> false immediately; nothing stays on screen that shouldn't.
 *
 * There is deliberately no synchronous `setState` in the effect body: the
 * derived return below covers the reset cases without a cascading render.
 *
 * @param {boolean} enabled Pass `false` to hold content hidden indefinitely
 *   (e.g. behind a preloader curtain) without arming the failsafe.
 * @param {number}  delayMs  Failsafe window. Long enough to beat the real
 *   animation in, short enough that a failure is not a long blank page.
 * @returns {boolean} `true` once the content should be visible.
 */
export default function useRevealFailsafe(enabled = true, delayMs = 2500) {
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!enabled || reduced) return undefined;

    const failsafe = window.setTimeout(() => setRevealed(true), delayMs);

    return () => window.clearTimeout(failsafe);
  }, [enabled, reduced, delayMs]);

  if (!enabled) return false;
  if (reduced) return true;

  return revealed;
}