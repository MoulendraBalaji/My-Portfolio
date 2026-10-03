import { m } from 'motion/react';

import { maskReveal, riseReveal, staggerWords, viewport } from '../../lib/motion';

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
 *
 * `mask={false}` swaps the clipping slide for an unclipped fade-and-rise. The
 * hero name uses it: the mask clips to the line box, and at a display line
 * height that box is shorter than the glyphs, so ascenders and the dot of an
 * `i` get shaved off. Nothing clips in this mode, so the name is guaranteed
 * complete whatever font or size is set.
 */
export default function MaskedText({
  text,
  as = 'span',
  className = '',
  play = true,
  mask = true
}) {
  const Tag = m[as] ?? m.span;
  const words = text.split(' ');

  const wordClass = mask ? 'masked__word' : 'masked__word masked__word--open';
  const innerClass = mask ? 'masked__inner' : 'masked__inner masked__inner--open';
  const innerVariants = mask ? maskReveal : riseReveal;

  return (
    <Tag
      className={`masked ${className}`.trim()}
      variants={staggerWords}
      initial="hidden"
      {...(play ? { whileInView: 'visible', viewport } : {})}
    >
      <span className="visually-hidden">{text}</span>
      {words.map((word, index) => (
        <span className={wordClass} key={`${word}-${index}`} aria-hidden="true">
          <m.span className={innerClass} variants={innerVariants}>
            {word}
          </m.span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}