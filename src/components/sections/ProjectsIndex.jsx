import { AnimatePresence, m, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Magnetic from '../ui/Magnetic.jsx';
import SmartImage from '../SmartImage/SmartImage.jsx';
import { useFinePointer, usePrefersReducedMotion } from '../../hooks/useEnv';
import useMediaQuery from '../../hooks/useMediaQuery';
import useRevealFailsafe from '../../hooks/useRevealFailsafe';
import { duration, ease, fadeUp, spring } from '../../lib/motion';

/** Dwell before a hover is treated as intent. Stops the row flickering as the
 *  pointer cuts across the list on the way somewhere else. */
const HOVER_INTENT_MS = 70;

/** Panel tilt, in degrees, at the extreme corner. */
const MAX_TILT = 3;

/* ------------------------------------------------------------- variants -- */

/**
 * Panel cross-fade. Enter is the fast part — the slow work is inside it (the
 * clip reveal and the image settle), so the panel itself is already in place and
 * nothing reflows while the content is still arriving.
 */
const panelVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.fast, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease } }
};

/** The frame wipes open from the bottom edge. */
const frameVariants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.7, ease } }
};

/** Cover art settles out of a gentle push-in, slightly slower than the wipe. */
const mediaVariants = {
  hidden: { scale: 1.18 },
  visible: { scale: 1, transition: { duration: 1.1, ease } }
};

const bodyVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } }
};

/** Reduced motion: opacity only. No clip-path, no scale, no stagger distance. */
const panelVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } }
};

const noReveal = { hidden: {}, visible: {}, exit: {} };

const rowStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
};

/* -------------------------------------------------------------- helpers -- */

/** Two-letter monogram for the fallback plate, e.g. "Scrybe.io" -> "SC". */
function initialsOf(title) {
  return title
    .split(/[\s.\-_/]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

/* --------------------------------------------------------------- panel -- */

function PreviewPanel({
  project,
  total,
  reduced,
  tilt,
  revealPanel,
  registerTiltTarget
}) {
  const panelVariantsUsed = reduced ? panelVariantsReduced : panelVariants;
  const frameUsed = reduced ? noReveal : frameVariants;
  const mediaUsed = reduced ? noReveal : mediaVariants;

  const counter = `${project.index} / ${String(total).padStart(2, '0')}`;
  const { paper, live, code } = project.links;

  return (
    <m.div
      className="preview"
      style={tilt.style}
      role="region"
      aria-live="polite"
      aria-label="Project preview"
    >
      <div className="preview__glow" aria-hidden="true" />

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={project.id}
          className="preview__inner"
          variants={panelVariantsUsed}
          initial="hidden"
          animate={revealPanel ? 'visible' : 'hidden'}
          exit="exit"
        >
          <m.div className="preview__frame" variants={frameUsed}>
            <m.div className="preview__frame-media" variants={mediaUsed} ref={registerTiltTarget}>
              <SmartImage
                src={project.image}
                alt=""
                ratio="16 / 10"
                fallbackText={initialsOf(project.title)}
              />
            </m.div>
          </m.div>

          <m.div className="preview__body" variants={bodyVariants} initial="hidden" animate="visible">
            <m.div className="preview__counter" variants={fadeUp}>
              <span className="preview__counter-value">{counter}</span>
              <span className="preview__counter-category">{project.category}</span>
            </m.div>

            <m.p className="preview__desc" variants={fadeUp}>
              {project.description}
            </m.p>

            {project.tech?.length ? (
              <m.ul className="preview__chips" variants={fadeUp}>
                {project.tech.map((tech) => (
                  <li key={tech} className="chip chip--mono">
                    {tech}
                  </li>
                ))}
              </m.ul>
            ) : null}

            {/* Every button is omitted when its link is absent — a disabled
                "Live demo" is worse than no button at all. */}
            <m.div className="preview__actions" variants={fadeUp}>
              {paper ? (
                <Magnetic>
                  <a className="btn btn--primary" href={paper}>
                    Read the paper
                    <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
                  </a>
                </Magnetic>
              ) : null}

              {live ? (
                <Magnetic>
                  <a className="btn btn--primary" href={live}>
                    Live demo
                    <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
                  </a>
                </Magnetic>
              ) : null}

              {code ? (
                // Primary only when there is nothing else to be primary about.
                <Magnetic>
                  <a
                    className={`btn ${live || paper ? 'btn--ghost' : 'btn--primary'}`}
                    href={code}
                  >
                    Code
                    <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
                  </a>
                </Magnetic>
              ) : null}
            </m.div>
          </m.div>
        </m.div>
      </AnimatePresence>
    </m.div>
  );
}

/* ------------------------------------------------------------ accordion -- */

/**
 * Body shared by the mobile accordion. Wrapped in the 0fr -> 1fr grid track so
 * the expand is a CSS transition rather than an animated height, and so a closed
 * row's links are `visibility: hidden` and cannot be tabbed into.
 */
function AccordionPanel({ project, total, reduced, revealPanel, panelId }) {
  const mediaUsed = reduced ? noReveal : mediaVariants;

  return (
    <div className="accordion__body" id={panelId} role="region" aria-label={`${project.title} details`}>
      <div className="accordion__body-inner">
        <m.div className="accordion__frame" animate={revealPanel ? 'visible' : 'hidden'} variants={mediaUsed}>
          <SmartImage
            src={project.image}
            alt=""
            ratio="16 / 10"
            fallbackText={initialsOf(project.title)}
          />
        </m.div>

        <p className="accordion__counter">
          {project.index} / {String(total).padStart(2, '0')} · {project.category}
        </p>

        <p className="accordion__desc">{project.description}</p>

        {project.tech?.length ? (
          <ul className="accordion__chips">
            {project.tech.map((tech) => (
              <li key={tech} className="chip chip--mono">
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="accordion__actions">
          {project.links.paper ? (
            <a className="btn btn--primary" href={project.links.paper}>
              Read the paper
              <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
            </a>
          ) : null}
          {project.links.live ? (
            <a className="btn btn--primary" href={project.links.live}>
              Live demo
              <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
            </a>
          ) : null}
          {project.links.code ? (
            <a
              className={`btn ${
                project.links.live || project.links.paper ? 'btn--ghost' : 'btn--primary'
              }`}
              href={project.links.code}
            >
              Code
              <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- index -- */

export default function ProjectsIndex({ projects }) {
  const total = projects.length;

  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();

  // Desktop and mobile are different components sharing one list. Rendering both
  // copies of the links would double every tab stop, so the branch is chosen in
  // JS and only one set of links exists in the DOM at a time.
  const compact = useMediaQuery('(max-width: 1023px)');

  const [activeId, setActiveId] = useState(projects[0]?.id);
  const [openId, setOpenId] = useState(projects[0]?.id);

  const revealed = useRevealFailsafe(true);

  const hoverTimer = useRef(null);
  const rowRefs = useRef([]);

  const active = useMemo(
    () => projects.find((project) => project.id === activeId) ?? projects[0],
    [projects, activeId]
  );

  /* ---- hover intent ---- */

  const cancelHover = useCallback(() => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }, []);

  // Pointer events fire on touch too, and there is no dwell on touch — so the
  // dwell path is desktop-only, and touch falls through to click.
  const scheduleActive = useCallback(
    (id) => {
      cancelHover();

      // Warm the image for the row about to become active so the reveal never
      // starts against an empty box.
      const next = projects.find((project) => project.id === id);
      if (next?.image) {
        const preloader = new Image();
        preloader.src = next.image;
      }

      hoverTimer.current = window.setTimeout(() => setActiveId(id), HOVER_INTENT_MS);
    },
    [cancelHover, projects]
  );

  useEffect(() => cancelHover, [cancelHover]);

  /* ---- keyboard: roving tabindex ---- */

  const focusRow = useCallback(
    (nextIndex) => {
      const bounded = (nextIndex + total) % total;
      const id = projects[bounded].id;

      setActiveId(id);
      rowRefs.current[bounded]?.focus();
    },
    [projects, total]
  );

  const handleKeyDown = useCallback(
    (event) => {
      const index = projects.findIndex((project) => project.id === activeId);

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          focusRow(index + 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          focusRow(index - 1);
          break;
        case 'Home':
          event.preventDefault();
          focusRow(0);
          break;
        case 'End':
          event.preventDefault();
          focusRow(total - 1);
          break;
        default:
          break;
      }
    },
    [activeId, focusRow, projects, total]
  );

  /* ---- tilt ---- */

  const tiltEnabled = fine && !reduced;
  const tiltTarget = useRef(null);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(pointerY, [0, 1], [MAX_TILT, -MAX_TILT]), spring.soft);
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-MAX_TILT, MAX_TILT]), spring.soft);

  const handleTiltMove = useCallback(
    (event) => {
      if (!tiltEnabled || !tiltTarget.current) return;

      const rect = tiltTarget.current.getBoundingClientRect();

      pointerX.set(Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)));
      pointerY.set(Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)));
    },
    [pointerX, pointerY, tiltEnabled]
  );

  const resetTilt = useCallback(() => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  }, [pointerX, pointerY]);

  /* ---- render ---- */

  return (
    <m.div
      className={`index ${compact ? 'index--compact' : 'index--split'}`}
      onPointerMove={compact ? undefined : handleTiltMove}
      onPointerLeave={compact ? undefined : resetTilt}
    >
      <m.ul
        className="index__list"
        variants={rowStagger}
        initial="hidden"
        animate={revealed ? 'visible' : 'hidden'}
      >
        {projects.map((project, index) => {
          const isActive = project.id === active?.id;
          const isOpen = project.id === openId;
          const panelId = `project-panel-${project.id}`;

          return (
            <m.li
              className="index__item"
              key={project.id}
              variants={fadeUp}
              data-open={compact && isOpen ? 'true' : undefined}
            >
              <button
                type="button"
                className={`index__row ${isActive ? 'is-active' : ''}`}
                // Roving tabindex: exactly one row is in the tab order.
                tabIndex={isActive ? 0 : -1}
                aria-expanded={compact ? isOpen : undefined}
                aria-controls={compact ? panelId : undefined}
                ref={(node) => {
                  rowRefs.current[index] = node;
                }}
                onPointerEnter={() => !compact && scheduleActive(project.id)}
                onPointerLeave={() => !compact && cancelHover()}
                onFocus={() => setActiveId(project.id)}
                onClick={() => {
                  if (compact) {
                    // One open at a time; tapping the open row closes it.
                    setOpenId(isOpen ? null : project.id);
                  } else {
                    setActiveId(project.id);
                  }
                }}
                onKeyDown={handleKeyDown}
              >
                <span className="index__index" aria-hidden="true">
                  {project.index}
                </span>

                <span className="index__title">{project.title}</span>

                <span className="index__tags">
                  <span className="index__pill">{project.category}</span>
                  {project.year ? <span className="index__pill">{project.year}</span> : null}
                </span>

                <span className="index__arrow" aria-hidden="true">
                  <ArrowUpRight size={22} strokeWidth={1.75} />
                </span>
              </button>

              {/*
                Always mounted on compact, open or closed. Conditionally
                mounting it would mean no collapse transition at all, and the
                `visibility: hidden` guard that keeps closed links out of the
                tab order would have nothing to guard.
              */}
              {compact ? (
                <AccordionPanel
                  project={project}
                  total={total}
                  reduced={reduced}
                  revealPanel={revealed}
                  panelId={panelId}
                />
              ) : null}
            </m.li>
          );
        })}
      </m.ul>

      {!compact ? (
        <PreviewPanel
          project={active}
          total={total}
          reduced={reduced}
          tilt={{ style: tiltEnabled ? { rotateX, rotateY } : undefined }}
          revealPanel={revealed}
          registerTiltTarget={(node) => {
            tiltTarget.current = node;
          }}
        />
      ) : null}
    </m.div>
  );
}