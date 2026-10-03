import { m } from 'motion/react';

import MaskedText from '../ui/MaskedText.jsx';
import Reveal from '../ui/Reveal.jsx';
import { fadeUp } from '../../lib/motion';

/**
 * Numbered section header: mono eyebrow (`01 — About`), masked display title
 * with one italic accent word, and an optional lead paragraph.
 */
export default function SectionHeading({ id, index, label, title, accent, children, className = '' }) {
  return (
    <Reveal className={`section-heading ${className}`.trim()} stagger>
      <m.p className="eyebrow section-heading__eyebrow" variants={fadeUp}>
        <span className="section-heading__index">{index}</span>
        {label}
      </m.p>

      <h2 className="display section-heading__title">
        <MaskedText text={title} />
        {accent ? (
          <>
            {' '}
            <em className="section-heading__accent">
              <MaskedText text={accent} />
            </em>
          </>
        ) : null}
      </h2>

      {children ? (
        <m.div className="lead section-heading__lead" variants={fadeUp}>
          {children}
        </m.div>
      ) : null}

      <span className="visually-hidden" id={id} />
    </Reveal>
  );
}