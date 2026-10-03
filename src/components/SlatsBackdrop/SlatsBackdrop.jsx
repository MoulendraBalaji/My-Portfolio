'use client';

import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import './SlatsBackdrop.css';

/**
 * SlatsBackdrop — decorative WebGL background built on the (protected) MicroSlats component.
 *
 * - Code-split: the shader chunk loads after first paint, so LCP is never the canvas.
 * - Client-only: the lazy component only renders after mount, so SSR (Next.js) never touches WebGL.
 * - Always has a CSS fallback underneath (static bg + glow) for no-WebGL2 / loading / failure.
 * - pointer-events: none. MicroSlats listens on `window`, so cursor ripples still work.
 *
 * The parent element MUST have `position: relative` and a real height.
 */
const MicroSlats = lazy(() => import('../MicroSlats/MicroSlats'));

// Canvas colors must be literal values (the shader parses them with a 2D canvas, which cannot
// resolve CSS variables). Keep these in sync with the design tokens:
//   --bg #07080B · --accent-2 #7C6CFF · --accent #C8FF3D
const COLORS = {
  bg: '#07080B',
  violet: '#7C6CFF',
  violetDeep: '#5B4FD6',
  lime: '#C8FF3D'
};

const VARIANTS = {
  // Instance 1 — hero
  hero: {
    preset: 'swell',
    color: COLORS.violet,
    glintColor: COLORS.lime,
    backgroundColor: COLORS.bg,
    roundness: 0.8,
    speed: 0.5,
    glint: 0.8,
    contrast: 1.3,
    perspective: 0.6,
    fog: 0.6,
    interactive: true,
    cursorStrength: 1.1,
    cursorSize: 48,
    swirl: 0.3,
    trail: 1.6,
    lean: 0.4,
    intro: true,
    introDuration: 1.8
  },
  // Instance 2 — contact (calmer; unspecified values come from the "tide" preset)
  contact: {
    preset: 'tide',
    color: COLORS.violetDeep,
    glintColor: COLORS.lime,
    backgroundColor: COLORS.bg,
    roundness: 0.8,
    speed: 0.4,
    glint: 0.3,
    interactive: true,
    lean: 0.3,
    intro: true,
    introDuration: 1.4
  }
};

const SLATS_DESKTOP = { slatWidth: 8, slatHeight: 22, gap: 3 };
const SLATS_SMALL = { slatWidth: 6, slatHeight: 16, gap: 2 };

/** No-op subscription: lets `useSyncExternalStore` detect "we are past hydration" without setState-in-effect. */
const NEVER_CHANGES = () => () => {};

/** Rendered in the same Suspense boundary as MicroSlats, so it mounts when the chunk resolves. */
function ReadySignal({ onReady }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

function SlatsBackdropBase({
  variant = 'hero',
  active = true, // hero: pass `preloaderDone` so the intro wave is actually seen
  mountOnVisible, // defaults to true for "contact" (mount + intro play when scrolled near)
  className = '',
  style
}) {
  const rootRef = useRef(null);
  const [seen, setSeen] = useState(false);
  const [ready, setReady] = useState(false);

  // `false` while server-rendering / hydrating, `true` from the first client commit onwards.
  const mounted = useSyncExternalStore(NEVER_CHANGES, () => true, () => false);

  const isSmall = useMediaQuery('(max-width: 767px)');
  const isCoarse = useMediaQuery('(pointer: coarse)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const lazyMount = mountOnVisible ?? variant === 'contact';

  // Pure environment read — no setState needed to fall back when IntersectionObserver is absent.
  const canObserve = typeof IntersectionObserver !== 'undefined';
  const near = !lazyMount || !canObserve || seen;

  // Defer mounting until the section is near the viewport (so the intro plays when seen).
  // The only setState happens inside the observer callback, i.e. a genuine external-system event.
  useEffect(() => {
    if (!lazyMount || !canObserve) return undefined;
    const node = rootRef.current;
    if (!node) return undefined;
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [lazyMount, canObserve]);

  const handleReady = useCallback(() => setReady(true), []);

  const shaderProps = useMemo(() => {
    const next = { ...(VARIANTS[variant] || VARIANTS.hero), ...(isSmall ? SLATS_SMALL : SLATS_DESKTOP) };
    if (isSmall) next.cursorSize = 36;
    if (isCoarse) next.cursorStrength = 0.8;
    return next;
  }, [variant, isSmall, isCoarse]);

  // Reduced motion: don't wait for the preloader (MicroSlats itself renders a calm static frame).
  const shouldMount = mounted && near && (active || reducedMotion);

  return (
    <div
      ref={rootRef}
      className={`slats-backdrop slats-backdrop--${variant} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <div className="slats-backdrop__fallback" />
      <div className="slats-backdrop__shader" data-ready={ready ? 'true' : 'false'}>
        {shouldMount && (
          <Suspense fallback={null}>
            <MicroSlats {...shaderProps} />
            <ReadySignal onReady={handleReady} />
          </Suspense>
        )}
      </div>
      <div className="slats-backdrop__overlay" />
      <div className="slats-backdrop__vignette" />
    </div>
  );
}

const SlatsBackdrop = memo(SlatsBackdropBase);
SlatsBackdrop.displayName = 'SlatsBackdrop';

/** Instance 1 — hero (preset "swell"). Usage: <HeroSlats active={preloaderDone} /> */
export const HeroSlats = props => <SlatsBackdrop variant="hero" {...props} />;

/** Instance 2 — contact (preset "tide"). Usage: <ContactSlats /> */
export const ContactSlats = props => <SlatsBackdrop variant="contact" {...props} />;

export default SlatsBackdrop;