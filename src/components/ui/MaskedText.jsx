import { m } from 'motion/react';

import { maskReveal, staggerWords, viewport } from '../../lib/motion';

/**
 * Word-by-word masked reveal for display headlines.
 *
 * Each word lives in an `overflow:hidden` mask and slides up from beneath its
 * own mask line. The full string is exposed once to assistive tech as plain
 * text, and the animated per-word spans are hidden from it — so the headline
 * is announced as one sentence rather than a column of fragments.
 *
 * `play={false}` holds the headline hidden with no trigger attached. The hero
 * uses it to keep the title back until the preloader curtain has lifted.
 */
export default function MaskedText({ text, as = 'span', className = '', play = true }) {
  const Tag = m[as] ?? m.span;
  const words = text.split(' ');

  return (
    <Tag
      className={`masked ${className}`.trim()}
      variants={staggerWords}
      initial="hidden"
      {...(play ? { whileInView: 'visible', viewport } : {})}
    >
      <span className="visually-hidden">{text}</span>
      {words.map((word, index) => (
        <span className="masked__word" key={`${word}-${index}`} aria-hidden="true">
          <m.span className="masked__inner" variants={maskReveal}>
            {word}
          </m.span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}