import { m, motion, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { useRef } from 'react';

import SectionHeading from './SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import { fadeUp, spring, staggerContainer } from '../../lib/motion';
import { experience, sectionMeta } from '../../data/portfolio.js';
import './Experience.css';

export default function Experience() {
  const trackRef = useRef(null);

  // The rail draws itself as the section scrolls past.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 72%', 'end 60%']
  });
  const railScale = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <section id="experience" className="section section--elevated" aria-labelledby="experience-heading">
      <div className="shell">
        <SectionHeading
          id="experience-heading"
          index={sectionMeta.experience.index}
          label={sectionMeta.experience.label}
          title="Where the work"
          accent="happened."
        />

        <div className="timeline" ref={trackRef}>
          <span className="timeline__rail" aria-hidden="true">
            <motion.span className="timeline__rail-fill" style={{ scaleY: railScale }} />
          </span>

          {experience.map((role) => (
            <Reveal key={role.id} className={`timeline__item ${role.featured ? 'is-featured' : ''}`} stagger>
              <m.span
                className="timeline__node"
                aria-hidden="true"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={spring.snappy}
              />

              <article className="timeline__card">
                <header className="timeline__head">
                  <div className="timeline__heading">
                    <h3 className="timeline__role">{role.role}</h3>
                    <p className="timeline__company">
                      <a href={role.companyUrl} target="_blank" rel="noopener noreferrer">
                        {role.company}
                        <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
                      </a>
                    </p>
                  </div>

                  <div className="timeline__meta">
                    {role.status === 'completed' ? (
                      <span className="chip chip--accent timeline__badge">
                        <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                        Completed
                      </span>
                    ) : null}
                    <span className="timeline__dates">
                      {role.start} – {role.end}
                    </span>
                    <span className="timeline__location">{role.location}</span>
                  </div>
                </header>

                <m.p className="timeline__summary" variants={fadeUp}>
                  {role.summary}
                </m.p>

                <m.ul className="timeline__achievements" variants={staggerContainer}>
                  {role.achievements.map((item) => (
                    <m.li key={item} variants={fadeUp}>
                      {item}
                    </m.li>
                  ))}
                </m.ul>

                <m.div className="timeline__foot" variants={fadeUp}>
                  <ul className="chip-row">
                    {role.tech.map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <ul className="timeline__links">
                    {role.links.map((link) => (
                      <li key={link.href}>
                        <a
                          className="link-arrow"
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label} →
                        </a>
                      </li>
                    ))}
                  </ul>
                </m.div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}