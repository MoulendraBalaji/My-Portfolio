import { m } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Suspense, lazy } from 'react';

import SectionHeading from './SectionHeading.jsx';
import CountUp from '../ui/CountUp.jsx';
import Magnetic from '../ui/Magnetic.jsx';
import Reveal from '../ui/Reveal.jsx';
import SmartImage from '../SmartImage/SmartImage.jsx';
import { fadeUp } from '../../lib/motion';
import { research, sectionMeta } from '../../data/portfolio.js';
import './Research.css';

// Charts sit below the fold and are purely decorative — keep them out of the
// initial bundle and reserve their height with a skeleton while they load.
const ModelComparison = lazy(() =>
  import('./Charts.jsx').then((mod) => ({ default: mod.ModelComparison }))
);
const DeclineTiers = lazy(() =>
  import('./Charts.jsx').then((mod) => ({ default: mod.DeclineTiers }))
);

function ChartSkeleton() {
  return (
    <div className="chart-skeleton" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

export default function Research() {
  return (
    <section id="research" className="section" aria-labelledby="research-heading">
      <div className="shell">
        <SectionHeading id="research-heading" index={sectionMeta.research.index} label={sectionMeta.research.label} title="Does query-portfolio" accent="diversification predict decline?" />

        <Reveal className="research__intro" stagger>
          <m.p className="eyebrow" variants={fadeUp}>
            {research.eyebrow}
          </m.p>
          <m.h3 className="research__title" variants={fadeUp}>
            {research.title}
          </m.h3>
          <m.p className="lead" variants={fadeUp}>
            {research.summary}
          </m.p>
        </Reveal>

        <Reveal className="research__stats" stagger>
          {research.stats.map((stat) => (
            <m.div className="research__stat" key={stat.label} variants={fadeUp}>
              <span className="research__stat-value">
                {/* `text` stats are fixed strings such as "0.62 vs 0.52" — nothing to count. */}
                {stat.text ?? (
                  <CountUp
                    value={stat.value}
                    decimals={stat.decimals ?? 0}
                    prefix={stat.prefix ?? ''}
                    suffix={stat.suffix ?? ''}
                  />
                )}
              </span>
              <span className="research__stat-label">{stat.label}</span>
              <span className="research__stat-hint">{stat.hint}</span>
            </m.div>
          ))}
        </Reveal>

        <div className="research__charts">
          <Suspense fallback={<ChartSkeleton />}>
            <ModelComparison data={research.comparison} />
            <DeclineTiers data={research.decline} />
          </Suspense>
        </div>

        <Reveal className="research__actions" stagger>
          <m.div variants={fadeUp}>
            <Magnetic>
              <a className="btn btn--primary" href={research.url} target="_blank" rel="noopener noreferrer">
                {research.cta}
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
              </a>
            </Magnetic>
          </m.div>

          <m.a
            className="research__preview"
            href={research.url}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeUp}
          >
            <SmartImage
              src={research.preview}
              alt=""
              ratio="16 / 10"
              width={1600}
              height={1000}
              sizes="(max-width: 1024px) 90vw, 320px"
              fallbackText="QP"
            />
            <span className="research__preview-caption">Preview the paper ↗</span>
          </m.a>

          <m.p className="research__caveat" variants={fadeUp}>
            {research.caveat}
          </m.p>

          <m.ul className="chip-row research__tags" variants={fadeUp}>
            {research.tags.map((tag) => (
              <li key={tag} className="chip chip--violet">
                {tag}
              </li>
            ))}
          </m.ul>
        </Reveal>
      </div>
    </section>
  );
}