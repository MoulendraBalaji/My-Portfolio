import { LazyMotion, MotionConfig, domMax } from 'motion/react';

/**
 * App-wide motion configuration.
 *
 * `reducedMotion="user"` makes Framer Motion honour the OS setting: transform
 * and layout animations are dropped, while opacity cross-fades are kept so
 * content still fades in rather than appearing frozen mid-transition.
 *
 * `domMax` rather than `domAnimation`: the nav's active pill animates via
 * `layoutId`, and layout animations are only present in the `domMax` bundle.
 * That is the one feature forcing the larger bundle — everything else stays
 * on `m`.
 */
export default function MotionRoot({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domMax} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}