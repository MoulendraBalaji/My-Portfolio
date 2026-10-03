import MotionRoot from './components/motion/MotionRoot.jsx';
import { about, meta, research } from './data/portfolio.js';

/**
 * Temporary shell — replaced section by section in Phases 2 and 3.
 * Its only job is to prove the foundation (tokens, fonts, MotionConfig) renders.
 */
export default function App() {
  return (
    <MotionRoot>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <main id="main">
        <section className="section" id="about" aria-labelledby="about-h">
          <div className="shell">
            <p className="eyebrow">01 — About</p>
            <h1 className="display" id="about-h">
              {meta.title.split(' — ')[0]} <em>{'design system online'}</em>
            </h1>
            <p className="lead">{about.lead}</p>
            <p className="lead">
              Research: {research.title} — <a href={research.url}>{research.url}</a>
            </p>
          </div>
        </section>
      </main>
    </MotionRoot>
  );
}