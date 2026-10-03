import { useCallback, useSyncExternalStore } from 'react';

/**
 * SSR-safe media query subscription.
 *
 * The server snapshot is always `false`, which means the first client render also
 * returns `false` (i.e. "desktop" values by default). The real value arrives on the
 * commit that follows, so markup stays hydration-safe.
 */
export default function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return undefined;
      }
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia(query).matches;
  }, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}