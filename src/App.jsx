import { useCallback, useState } from 'react';

import Cursor from './components/layout/Cursor.jsx';
import Footer from './components/layout/Footer.jsx';
import Nav from './components/layout/Nav.jsx';
import Preloader from './components/layout/Preloader.jsx';
import ScrollProgress from './components/layout/ScrollProgress.jsx';
import MotionRoot from './components/motion/MotionRoot.jsx';
import About from './components/sections/About.jsx';
import Contact from './components/sections/Contact.jsx';
import Education from './components/sections/Education.jsx';
import Experience from './components/sections/Experience.jsx';
import Hero from './components/sections/Hero.jsx';
import Projects from './components/sections/Projects.jsx';
import Research from './components/sections/Research.jsx';
import Skills from './components/sections/Skills.jsx';
import { meta } from './data/portfolio.js';
import { useAssetAvailable } from './hooks/useAssetAvailable.js';

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const resumeAvailable = useAssetAvailable(meta.resume);

  // Stable identity: Preloader keeps `onDone` in a useCallback and re-arms its
  // completion timer whenever that callback changes. An inline arrow would give
  // it a new identity on every App render, so the timer would reset each time
  // and `preloaderDone` could stay false — leaving the hero at opacity 0.
  const handlePreloaderDone = useCallback(() => setPreloaderDone(true), []);

  return (
    <MotionRoot>
      <ScrollProgress />
      <Cursor />

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Nav resumeAvailable={resumeAvailable} />

      <main id="main">
        <Hero preloaderDone={preloaderDone} />
        <About />
        <Experience />
        <Research />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>

      <Footer />

      <Preloader onDone={handlePreloaderDone} />
    </MotionRoot>
  );
}