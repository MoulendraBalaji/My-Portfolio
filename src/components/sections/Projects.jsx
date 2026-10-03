import { m, useInView, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import SectionHeading from './SectionHeading.jsx';
import SmartImage from '../SmartImage/SmartImage.jsx';
import Magnetic from '../ui/Magnetic.jsx';
import Reveal from '../ui/Reveal.jsx';
import { fadeUp, staggerContainer } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/useEnv.js';
import { projects, sectionMeta } from '../../data/portfolio.js';
import './Projects.css';

const MAX_STACK = 6; // beyond this the rest collapse into the "More work" list

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
  // Cover art settles from 1.18 as the card arrives.
  const imageScale = useTransform(progress, [start, end], [1.18, 1]);

  // If the card cannot fit the viewport, drop out of the stack entirely so no
  // content is ever cropped or stranded behind the next card.
  useEffect(() => {
    const node = frameRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return undefined;

    const measure = () => {
      const navHeight = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
      );
      // `offsetTop` is relative to `.project-slot` (the nearest positioned
      // ancestor) and already includes the cascading stack offset, so this is
      // how far down the viewport the card's bottom edge actually sits.
      const top = Number.isFinite(node.offsetTop) ? node.offsetTop : 0;
      const available = window.innerHeight - (Number.isNaN(navHeight) ? 68 : navHeight) - top - 48;
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
  const imageStyle = isStacked ? { scale: imageScale } : undefined;

  const handlePointerMove = (event) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  const [primary, ...secondary] = project.links ?? [];

  return (
    <div
      className={`project-slot ${isStacked ? 'is-stacked' : 'is-static'}`}
      style={{ '--slot-index': index }}
    >
      <div className="project-slot__sticky">
        <m.article
          ref={frameRef}
          className={`project project--tint-${index % 2 === 0 ? 'violet' : 'lime'}`}
          style={motionStyle}
          onPointerMove={handlePointerMove}
          aria-labelledby={`project-${project.slug}`}
        >
          <span className="project__spotlight" aria-hidden="true" />
          {isStacked ? <span className="project__dim" style={{ opacity: dim }} aria-hidden="true" /> : null}

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
                <span className="chip chip--violet">{project.category}</span>
                {project.badge ? <span className="chip">{project.badge}</span> : null}
              </m.div>

              <m.h3 className="project__title display" id={`project-${project.slug}`} variants={fadeUp}>
                {project.title}
              </m.h3>

              <m.p className="project__role" variants={fadeUp}>
                {project.role}
              </m.p>

              <m.p className="project__desc" variants={fadeUp}>
                {project.description}
              </m.p>

              <m.ul className="chip-row project__tech" variants={fadeUp}>
                {project.tech.map((tech) => (
                  <li key={tech} className="chip">
                    {tech}
                  </li>
                ))}
              </m.ul>

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

            <div className="project__visual">
              <m.div className="project__image-frame" style={imageStyle}>
                <div className="project__image-zoom">
                  <SmartImage
                    src={project.image}
                    alt=""
                    ratio="16 / 10"
                    width={1600}
                    height={1000}
                    sizes="(max-width: 1024px) 92vw, 560px"
                    fallbackText={project.title}
                  />
                </div>
              </m.div>
            </div>
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

  const stacked = projects.slice(0, MAX_STACK);
  const overflow = projects.slice(MAX_STACK);

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

      {/* Scroll container holds only the sticky slots, so the progress math
          maps cleanly onto the stack. */}
      <div className="projects__stack" ref={stackRef}>
        {stacked.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={index}
            total={stacked.length}
            progress={scrollYProgress}
            stacked={!reduced}
          />
        ))}
      </div>

      {overflow.length ? (
        <Reveal className="shell projects__more" stagger>
          <p className="eyebrow">More work</p>
          <ul>
            {overflow.map((project) => (
              <li key={project.slug}>
                <a href={project.links?.[0]?.href} target="_blank" rel="noopener noreferrer">
                  {project.title}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      <div className="projects__spacer" aria-hidden="true" />
    </section>
  );
}