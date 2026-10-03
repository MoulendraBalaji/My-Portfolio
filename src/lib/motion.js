/**
 * Shared motion language.
 *
 * Everything animated on this site pulls its easing, springs and variants from
 * here so the whole thing moves like one piece. Only `transform`, `opacity`
 * and `clip-path` are ever animated — never width/height/top/left — so nothing
 * can trigger layout shift.
 */

/** The house curve. Matches `--ease-out` in styles/globals.css. */
export const ease = [0.22, 1, 0.36, 1];

export const spring = {
  soft: { type: 'spring', stiffness: 120, damping: 20 },
  snappy: { type: 'spring', stiffness: 260, damping: 24 }
};

/** Durations are deliberately clamped to the 0.4s–0.9s band. */
export const duration = {
  fast: 0.4,
  base: 0.6,
  slow: 0.7,
  slower: 0.9
};

/** Standard viewport config: reveal once, slightly before fully in view. */
export const viewport = { once: true, margin: '-80px' };

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.slow, ease } }
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease } }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: duration.slow, ease } }
};

/**
 * Parent wrapper that staggers its children. Pair with the variants above:
 * <m.div variants={staggerContainer} initial="hidden" whileInView="visible">
 */
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
};

/**
 * Word-by-word reveal for display headlines.
 *
 * Each word sits in its own `overflow:hidden` mask; the word slides up from
 * below the mask line. Render with <MaskedText text="..." /> — never apply this
 * directly to a bare string, the mask wrapper is what sells the effect.
 */
export const maskReveal = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: duration.slower, ease }
  }
};

export const staggerWords = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } }
};

/** Lifts a card on hover without touching layout. */
export const hoverLift = {
  y: -6,
  transition: { duration: duration.fast, ease }
};

export const tapScale = { scale: 0.97 };