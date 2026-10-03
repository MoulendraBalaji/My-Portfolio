import { useEffect, useState } from 'react';

/**
 * Scroll-spy over the section ids in `ids`.
 *
 * Uses a band across the upper third of the viewport and picks whichever
 * tracked section overlaps it most, which is stable for sections of very
 * different heights (a full-bleed hero vs. a short achievements strip).
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] ?? null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node) => node instanceof Element);
    if (nodes.length === 0) return undefined;

    const ratios = new Map();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target.id, entry.intersectionRatio);

        let bestId = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId) setActive(bestId);
      },
      {
        rootMargin: '-12% 0px -55% 0px',
        threshold: [0, 0.05, 0.15, 0.3, 0.5, 0.75, 1]
      }
    );

    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, [ids]);

  return active;
}