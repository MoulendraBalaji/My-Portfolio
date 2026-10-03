import { m } from 'motion/react';

import { fadeUp, staggerContainer, viewport } from '../../lib/motion';

/**
 * Scroll-triggered entrance using the shared variants.
 *
 * `<Reveal stagger>` turns the element into a stagger parent so its children —
 * which should each carry `variants={fadeUp}` — cascade in.
 */
export default function Reveal({
  as = 'div',
  variant = fadeUp,
  stagger = false,
  className = '',
  children,
  ...rest
}) {
  const Tag = m[as] ?? m.div;

  return (
    <Tag
      className={className}
      variants={stagger ? staggerContainer : variant}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      {...rest}
    >
      {children}
    </Tag>
  );
}