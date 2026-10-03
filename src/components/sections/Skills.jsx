import { m } from 'motion/react';
import { useState } from 'react';

import SectionHeading from './SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import { usePrefersReducedMotion } from '../../hooks/useEnv.js';
import { fadeUp } from '../../lib/motion';
import { marqueeItems, sectionMeta, skills } from '../../data/portfolio.js';
import './Skills.css';

/** One seamless row. Duplicated track + edge fade make the loop invisible. */
function MarqueeRow({ items, reverse = false, durationSeconds }) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="marquee"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <m.div
        className="marquee__track"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{
          duration: durationSeconds,
          ease: 'linear',
          repeat: Infinity,
          // Pausing mid-flight keeps the seam hidden.
          ...(paused ? { duration: 0 } : {})
        }}
      >
        {[0, 1].map((copy) => (
          <ul className="marquee__group" key={copy} aria-hidden={copy === 1}>
            {items.map((item) => (
              <li className="marquee__item" key={`${copy}-${item}`}>
                {item}
              </li>
            ))}
          </ul>
        ))}
      </m.div>
    </div>
  );
}

export default function Skills() {
  const reduced = usePrefersReducedMotion();

  const half = Math.ceil(marqueeItems.length / 2);
  const rowA = marqueeItems.slice(0, half);
  const rowB = marqueeItems.slice(half);

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
            <MarqueeRow items={rowA} durationSeconds={38} />
            <MarqueeRow items={rowB.length ? rowB : rowA} reverse durationSeconds={44} />
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