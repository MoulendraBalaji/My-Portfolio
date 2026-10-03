import { m, useInView, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import SectionHeading from './SectionHeading.jsx';
import Magnetic from '../ui/Magnetic.jsx';
import { fadeUp, staggerContainer } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/useEnv.js';
import { projects, sectionMeta } from '../../data/portfolio.js';
import './Projects.css';

/* One accent per card, cycled. Each drives that card's wave and keyline so no
   two neighbours read the same. */
const WAVE_ACCENTS = [
  [200, 255, 61], // lime
  [124, 108, 255], // violet
  [90, 214, 220], // cyan
  [255, 138, 92], // ember
  [244, 114, 182] // rose
];

const pad2 = (value) => String(value).padStart(2, '0');

function ProjectCard({ project, index, total, progress, stacked }) {
  const frameRef = useRef(null);
  const inView = useInView(frameRef, { once: true, margin: '-80px' });
  const [overflows, setOverflows] = useState(false);

  const start = total > 0 ? index / total : 0;
  const end = total > 0 ? (index + 1) / total : 1;
  const span = total > 0 ? 1 / total : 1;
  const isLast = index >= total - 1;

  // Later cards scale down slightly, so earlier ones read as a receding deck.
  const targetScale = 1 - (total - index) * 0.045;
  const cardScale = useTransform(progress, [start, 1], [1, targetScale]);
  // Dimming is an overlay opacity, never a CSS filter.
  //
  // A card is covered by the *next* one, so it must dim over the following
  // window — [end, end + span] — not over its own. The final card is never
  // covered, so its output is pinned to 0 (the input range stays valid to
  // avoid a degenerate mapping).
  const dimFrom = isLast ? 1 - span : end;
  const dim = useTransform(
    progress,
    [dimFrom, dimFrom + span],
    isLast ? [0, 0] : [0, 0.55]
  );

  // If the card cannot fit the viewport, drop out of the stack entirely so no
  // content is ever cropped or stranded behind the next card.
  useEffect(() => {
    const node = frameRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return undefined;

    const measure = () => {
      const navHeight = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
      );
      const available = window.innerHeight - (Number.isNaN(navHeight) ? 68 : navHeight) - 48;
      setOverflows(node.scrollHeight > available);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const isStacked = stacked && !overflows;
  const motionStyle = isStacked
    ? { scale: cardScale, transformOrigin: 'top center' }
    : undefined;

  const handlePointerMove = (event) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  const [primary, ...secondary] = project.links ?? [];
  const rgb = WAVE_ACCENTS[index % WAVE_ACCENTS.length].join(', ');
  // Desynchronise the waves so they never pulse in lockstep.
  const waveStyle = {
    '--wave-rgb': rgb,
    '--wave-delay': `${-((index * 1.7) % 9).toFixed(2)}s`,
    '--wave-speed': `${(9 + (index % 5) * 1.6).toFixed(1)}s`
  };

  return (
    <div
      className={`project-slot ${isStacked ? 'is-stacked' : 'is-static'}`}
      style={{ '--slot-index': index }}
    >
      <div className="project-slot__sticky">
        <m.article
          ref={frameRef}
          className="project"
          style={{ ...motionStyle, ...waveStyle }}
          onPointerMove={handlePointerMove}
          aria-labelledby={`project-${project.slug}`}
        >
          <span className="project__spotlight" aria-hidden="true" />
          {isStacked ? <span className="project__dim" style={{ opacity: dim }} aria-hidden="true" /> : null}

          {/* Text-only card: a slow colour wave behind the content. */}
          <span className="project__wave" aria-hidden="true" />
          <span className="project__wave project__wave--mid" aria-hidden="true" />

          <div className="project__inner">
            <m.div
              className="project__text"
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <m.div className="project__meta" variants={fadeUp}>
                <span className="project__index">
                  {pad2(index + 1)} <span aria-hidden="true">/</span> {pad2(total)}
                </span>
                <span className="chip">{project.category}</span>
                {project.badge ? <span className="chip">{project.badge}</span> : null}
              </m.div>

              <m.h3 className="project__title display" id={`project-${project.slug}`} variants={fadeUp}>
                {project.title}
              </m.h3>

              <m.p className="project__desc" variants={fadeUp}>
                {project.description}
              </m.p>

              {project.links?.length ? (
                <m.div className="project__actions" variants={fadeUp}>
                  {primary ? (
                    <Magnetic>
                      <a
                        className="btn btn--primary btn--sm"
                        href={primary.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {primary.label}
                      </a>
                    </Magnetic>
                  ) : null}
                  {secondary.map((link) => (
                    <a
                      key={link.href}
                      className="btn btn--ghost btn--sm"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </m.div>
              ) : null}
            </m.div>
          </div>
        </m.article>
      </div>
    </div>
  );
}

export default function Projects() {
  const stackRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end']
  });

  return (
    <section id="projects" className="section projects" aria-labelledby="projects-heading">
      <div className="shell">
        <SectionHeading
          id="projects-heading"
          index={sectionMeta.projects.index}
          label={sectionMeta.projects.label}
          title="Selected"
          accent="work."
        />
      </div>

      {/* Every project is a card. The old "More work" overflow list is gone. */}
      <div className="projects__stack" ref={stackRef}>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={index}
            total={projects.length}
            progress={scrollYProgress}
            stacked={!reduced}
          />
        ))}
      </div>

      <div className="projects__spacer" aria-hidden="true" />
    </section>
  );
}