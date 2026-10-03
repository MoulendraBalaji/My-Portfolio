import { m, useScroll, useSpring } from 'motion/react';

/** 2px acid-lime scroll progress rail, pinned to the top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 34, restDelta: 0.001 });

  return <m.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}