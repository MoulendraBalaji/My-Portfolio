import { m } from 'motion/react';

import SectionHeading from './SectionHeading.jsx';
import SmartImage from '../SmartImage/SmartImage.jsx';
import CountUp from '../ui/CountUp.jsx';
import Reveal from '../ui/Reveal.jsx';
import SpotlightCard from '../ui/SpotlightCard.jsx';
import { about, sectionMeta } from '../../data/portfolio.js';
import { fadeUp } from '../../lib/motion';

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="shell">
        <SectionHeading id="about-heading" index={sectionMeta.about.index} label={sectionMeta.about.label} title="Engineering intelligence" accent="into interfaces." />

        <div className="about__grid">
          <Reveal className="about__body" stagger>
            <m.p className="lead about__lead" variants={fadeUp}>
              {about.lead}
            </m.p>

            {[about.drives, about.differentiators].map((group) => (
              <m.div className="about__group" key={group.title} variants={fadeUp}>
                <h3 className="about__group-title">{group.title}</h3>
                <ul className="about__list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </m.div>
            ))}
          </Reveal>

          <Reveal className="about__aside" stagger>
            <m.div variants={fadeUp}>
              <SmartImage
                src={about.portrait}
                alt="Moulendra Balaji"
                ratio="4 / 5"
                position="50% 8%"
                width={720}
                height={1280}
                sizes="(max-width: 900px) 90vw, 380px"
                fallbackText="MB"
              />
            </m.div>

            <ul className="about__stats">
              {about.stats.map((stat) => (
                <li key={stat.label}>
                  <SpotlightCard className="about__stat">
                    <span className="about__stat-value">
                      <CountUp
                        value={stat.value}
                        suffix={stat.suffix}
                        prefix={stat.prefix}
                      />
                    </span>
                    <span className="about__stat-label">{stat.label}</span>
                    <span className="about__stat-hint">{stat.hint}</span>
                  </SpotlightCard>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}