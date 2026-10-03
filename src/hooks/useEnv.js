import useMediaQuery from './useMediaQuery';

/** True when the user has asked the OS to reduce motion. */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** Fine pointer + hover: the only place cursor-driven effects are enabled. */
export function useFinePointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}