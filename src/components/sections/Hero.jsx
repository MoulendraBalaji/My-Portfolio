import { m, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight, Check } from 'lucide-react';
import { useRef } from 'react';

import { HeroSlats } from '../SlatsBackdrop/SlatsBackdrop.jsx';
import SmartImage from '../SmartImage/SmartImage.jsx';
import Magnetic from '../ui/Magnetic.jsx';
import MaskedText from '../ui/MaskedText.jsx';
import { ease, fadeUp, staggerContainer, viewport } from '../../lib/motion';
import { experience, hero } from '../../data/portfolio.js';
import './Hero.css';

const flyrank = experience.find((role) => role.id === 'flyrank');

export default function Hero({ preloaderDone }) {
  const ref = useRef(null);
  const portraitRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Portrait drifts and lifts slightly slower than the page for a soft parallax.
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 46]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section id="hero" ref={ref} className="hero" aria-labelledby="hero-name">
      {/* Instance 1 of 2. Mounted only after the preloader so the intro wave is seen. */}
      <HeroSlats active={preloaderDone} />

      <div className="hero__content shell">
        <m.div className="hero__copy" style={{ y: copyY, opacity: copyOpacity }}>
          <m.p
            className="eyebrow hero__eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          >
            {hero.eyebrow}
          </m.p>

          <h1 className="hero__title" id="hero-name">
            <span className="visually-hidden">
              {hero.name} {hero.nameAccent}
            </span>
            <MaskedText as="span" className="hero__title-line" text={hero.name} />
            <MaskedText as="span" className="hero__title-line" text={hero.nameAccent} />
          </h1>

          <m.div
            className="hero__meta"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <m.p className="hero__role" variants={fadeUp}>
              {hero.role}
            </m.p>
            <m.p className="hero__value" variants={fadeUp}>
              {hero.value}
            </m.p>

            {flyrank ? (
              <m.p className="hero__chip" variants={fadeUp}>
                <span className="chip chip--accent hero__status">
                  <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                  Completed · {flyrank.start} – {flyrank.end}
                </span>
                <span className="hero__status-company">
                  ML Internship @ {flyrank.company}
                </span>
              </m.p>
            ) : null}

            <m.div className="hero__actions" variants={fadeUp}>
              <Magnetic>
                <a className="btn btn--primary" href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <ArrowDownRight size={15} strokeWidth={2} aria-hidden="true" />
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn btn--ghost" href={hero.secondaryCta.href}>
                  {hero.secondaryCta.label}
                </a>
              </Magnetic>
            </m.div>
          </m.div>
        </m.div>

        <m.div
          ref={portraitRef}
          className="hero__portrait"
          style={{ y: portraitY, scale: portraitScale }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.25 }}
        >
          <SmartImage
            src={hero.portrait}
            alt="Portrait of Moulendra Balaji"
            ratio="4 / 5"
            width={1200}
            height={1500}
            sizes="(max-width: 900px) 70vw, 420px"
            priority
            fallbackText="MB"
          />
          <span className="hero__portrait-ring" aria-hidden="true" />
        </m.div>
      </div>

      <m.a
        className="hero__scroll"
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        whileInView="visible"
        viewport={viewport}
        aria-label="Scroll to About"
      >
        <span className="hero__scroll-label">Scroll</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </m.a>
    </section>
  );
}