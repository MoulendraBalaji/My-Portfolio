import { m, useInView } from 'motion/react';
import { useRef } from 'react';

import { duration, ease, staggerContainer } from '../../lib/motion';

/**
 * Model-comparison chart: grouped horizontal bars per metric.
 *
 * Bars grow from 0 on `scaleX` with `transform-origin: left` — no width
 * animation, so nothing reflows. Values are normalised per metric because the
 * axes differ (0.42–0.76), and the real figure is printed beside each bar.
 */
export function ModelComparison({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const max = Math.max(...data.metrics.map((_, mi) => Math.max(...data.series.map((s) => s.values[mi]))));

  return (
    <figure className="chart" ref={ref}>
      <figcaption className="chart__caption">{data.caption}</figcaption>

      <div className="chart__rows" variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
        {data.metrics.map((metric, mi) => (
          <div className="chart__row" key={metric}>
            <span className="chart__row-label">{metric}</span>

            <div className="chart__bars">
              {data.series.map((s, si) => {
                const value = s.values[mi];
                return (
                  <div className={`chart__bar chart__bar--${s.tone}`} key={s.key}>
                    <m.span
                      className="chart__bar-fill"
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: value / max } : { scaleX: 0 }}
                      transition={{ duration: duration.slower, ease, delay: mi * 0.08 + si * 0.05 }}
                    />
                    <span className="chart__bar-value">{value.toFixed(3).replace(/0$/, '')}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <ul className="chart__legend">
        {data.series.map((s) => (
          <li key={s.key} className={`chart__legend-item chart__bar--${s.tone}`}>
            <span className="chart__legend-swatch" aria-hidden="true" />
            {s.label}
          </li>
        ))}
      </ul>
    </figure>
  );
}

/**
 * Forward decline rate by query-concentration tier.
 *
 * Vertical bars, again driven by `scaleY` from the baseline so the axis label
 * strip below never moves.
 */
export function DeclineTiers({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const max = Math.max(...data.tiers.map((t) => t.value));

  return (
    <figure className="chart" ref={ref}>
      <figcaption className="chart__caption">{data.caption}</figcaption>

      <div className="chart__columns" variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
        {data.tiers.map((tier, index) => (
          <div className="chart__column" key={tier.label}>
            <span className="chart__column-value">{tier.value}%</span>
            <div className="chart__column-track">
              <m.span
                className={`chart__column-fill chart__column-fill--${tier.label.toLowerCase()}`}
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: tier.value / max } : { scaleY: 0 }}
                transition={{ duration: duration.slower, ease, delay: index * 0.1 }}
              />
            </div>
            <span className="chart__column-label">{tier.label}</span>
            <span className="chart__column-range">{tier.range}</span>
          </div>
        ))}
      </div>

      <p className="chart__note">{data.note}</p>
    </figure>
  );
}