import { Award, GraduationCap, Trophy } from 'lucide-react';
import { m } from 'motion/react';

import SectionHeading from './SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import SmartImage from '../SmartImage/SmartImage.jsx';
import SpotlightCard from '../ui/SpotlightCard.jsx';
import { fadeUp } from '../../lib/motion';
import { achievements, education, sectionMeta } from '../../data/portfolio.js';
import './Education.css';

export default function Education() {
  return (
    <section id="education" className="section" aria-labelledby="education-heading">
      <div className="shell">
        <SectionHeading
          id="education-heading"
          index={sectionMeta.achievements.index}
          label="Education & Achievements"
          title="Credentials &"
          accent="competitions."
        />

        <div className="edu__grid">
          <div className="edu__column">
            <Reveal stagger>
              <m.h3 className="edu__column-title" variants={fadeUp}>
                <GraduationCap size={17} strokeWidth={1.75} aria-hidden="true" />
                Education
              </m.h3>

              {education.map((entry) => (
                <SpotlightCard className="edu__card" key={entry.degree}>
                  <div className="edu__card-mark">
                    <SmartImage
                      src={entry.logo}
                      alt=""
                      ratio="1 / 1"
                      width={64}
                      height={64}
                      sizes="64px"
                      fallbackText={entry.school.slice(0, 2).toUpperCase()}
                    />
                  </div>
                  <div className="edu__card-body">
                    <h4 className="edu__degree">{entry.degree}</h4>
                    <p className="edu__school">{entry.school}</p>
                    <p className="edu__period">{entry.period}</p>
                  </div>
                </SpotlightCard>
              ))}
            </Reveal>
          </div>

          <div className="edu__column">
            <Reveal stagger>
              <m.h3 className="edu__column-title" variants={fadeUp}>
                <Trophy size={17} strokeWidth={1.75} aria-hidden="true" />
                Hackathons &amp; Competitions
              </m.h3>

              <ul className="edu__list">
                {achievements.competitions.map((item) => (
                  <m.li className="edu__list-item" key={item.title} variants={fadeUp}>
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </m.li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="edu__certs" stagger>
              <m.h3 className="edu__column-title" variants={fadeUp}>
                <Award size={17} strokeWidth={1.75} aria-hidden="true" />
                Certifications
              </m.h3>

              <ul className="edu__cert-grid">
                {achievements.certifications.map((cert) => (
                  <m.li className="edu__cert" key={cert.name} variants={fadeUp}>
                    <span className="edu__cert-name">{cert.name}</span>
                    <span className="edu__cert-issuer">{cert.issuer}</span>
                  </m.li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}