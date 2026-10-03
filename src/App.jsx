import { useState } from 'react';

import Cursor from './components/layout/Cursor.jsx';
import Footer from './components/layout/Footer.jsx';
import Nav from './components/layout/Nav.jsx';
import Preloader from './components/layout/Preloader.jsx';
import ScrollProgress from './components/layout/ScrollProgress.jsx';
import MotionRoot from './components/motion/MotionRoot.jsx';
import { meta } from './data/portfolio.js';
import { useAssetAvailable } from './hooks/useAssetAvailable.js';

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const resumeAvailable = useAssetAvailable(meta.resume);

  return (
    <MotionRoot>
      <ScrollProgress />
      <Cursor />

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Nav resumeAvailable={resumeAvailable} />

      <main id="main">
        {/* Sections are mounted in Phase 3. `preloaderDone` gates the hero shader. */}
        <section className="section" id="hero" style={{ minHeight: '60vh' }} aria-label="Introduction" />
      </main>

      <Footer />

      <Preloader onDone={() => setPreloaderDone(true)} data-active={preloaderDone} />
    </MotionRoot>
  );
}