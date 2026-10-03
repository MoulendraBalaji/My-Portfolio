import { m } from 'motion/react';

import SectionHeading from './SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import { usePrefersReducedMotion } from '../../hooks/useEnv.js';
import { fadeUp } from '../../lib/motion';
import { marqueeItems, sectionMeta, skills } from '../../data/portfolio.js';
import './Skills.css';

/**
 * One seamless row.
 *
 * The track holds two identical halves and is shifted by exactly -50%, so the
 * loop has no seam and the edge mask hides the join.
 *
 * Both rows carry the *full* item list rather than splitting it. A half-length
 * row is narrower than the container, which leaves a dead gap at the end of the
 * loop; repeating the whole list always overflows the row. The second row runs
 * the list backwards so the two rows counter-scroll.
 *
 * Deliberately no measuring, no ResizeObserver and no state: an earlier version
 * recomputed a repeat count from a measured ratio, and the sub-pixel jitter in
 * that ratio made the count oscillate between two values every frame, spinning
 * the main thread. The list is long enough to fill the row on its own.
 *
 * The scroll is a CSS animation rather than Motion so it stays on the
 * compositor and so `animation-play-state` can genuinely pause it — restarting
 * a Motion keyframe loop to fake a pause makes the row jump.
 */
function MarqueeRow({ items, reverse = false, durationSeconds }) {
  return (
    <div className={`marquee${reverse ? ' marquee--reverse' : ''}`}>
      <div
        className="marquee__track"
        style={{ '--marquee-duration': `${durationSeconds}s` }}
      >
        {[0, 1].map((half) => (
          <ul className="marquee__group" key={half} aria-hidden={half === 1}>
            {items.map((item) => (
              <li className="marquee__item" key={`${half}-${item}`}>
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="skills" className="section section--elevated" aria-labelledby="skills-heading">
      <div className="shell">
        <SectionHeading
          id="skills-heading"
          index={sectionMeta.skills.index}
          label={sectionMeta.skills.label}
          title="Tools I reach"
          accent="for."
        />

        {/* Static, wrapped grid instead of motion when reduced motion is on. */}
        {reduced ? (
          <Reveal className="marquee marquee--static" stagger>
            {marqueeItems.map((item) => (
              <m.span className="marquee__item" key={item} variants={fadeUp}>
                {item}
              </m.span>
            ))}
          </Reveal>
        ) : (
          <div className="marquee-pair">
            <MarqueeRow items={marqueeItems} durationSeconds={38} />
            <MarqueeRow items={[...marqueeItems].reverse()} reverse durationSeconds={44} />
          </div>
        )}

        <div className="skills__grid">
          {skills.map((group) => (
            <Reveal className="skills__group" key={group.label} stagger>
              <m.h3 className="skills__label" variants={fadeUp}>
                {group.label}
              </m.h3>
              <ul className="chip-row">
                {group.items.map((item) => (
                  <m.li className="chip" key={item} variants={fadeUp}>
                    {item}
                  </m.li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}