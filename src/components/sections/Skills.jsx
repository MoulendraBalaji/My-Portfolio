import { m } from 'motion/react';
import { useLayoutEffect, useRef, useState } from 'react';

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
 * loop has no seam. Each half repeats its group until it is wider than the
 * visible row — with only a handful of items a single copy is narrower than the
 * container, which leaves a dead gap at the end of the row. The edge mask hides
 * the join.
 *
 * The scroll is a CSS animation rather than Motion so it stays on the
 * compositor and so `animation-play-state` can genuinely pause it — restarting
 * a Motion keyframe loop to fake a pause makes the row jump.
 */
function MarqueeRow({ items, reverse = false, durationSeconds }) {
  const rowRef = useRef(null);
  const probeRef = useRef(null);
  const [copies, setCopies] = useState(1);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const probe = probeRef.current;
    if (!row || !probe || typeof ResizeObserver === 'undefined') return undefined;

    const measure = () => {
      const available = row.clientWidth;
      const groupWidth = probe.scrollWidth;
      if (!available || !groupWidth) return;
      // Repeat until one half covers the row, so -50% always loops off-screen.
      setCopies(Math.max(1, Math.ceil(available / groupWidth)));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    ro.observe(probe);
    return () => ro.disconnect();
  }, [items]);

  return (
    <div className={`marquee${reverse ? ' marquee--reverse' : ''}`} ref={rowRef}>
      <div
        className="marquee__track"
        style={{ '--marquee-duration': `${durationSeconds}s` }}
      >
        {[0, 1].map((half) => (
          <ul className="marquee__group" key={half} aria-hidden={half === 1}>
            {Array.from({ length: copies }, (_, copy) =>
              items.map((item) => (
                <li className="marquee__item" key={`${half}-${copy}-${item}`}>
                  {item}
                </li>
              ))
            )}
          </ul>
        ))}
      </div>

      {/* Single copy measured off-screen, outside the animated track so it
          cannot skew the -50% offset. */}
      <div className="marquee__measure" aria-hidden="true">
        <ul className="marquee__group" ref={probeRef}>
          {items.map((item) => (
            <li className="marquee__item" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </div>
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