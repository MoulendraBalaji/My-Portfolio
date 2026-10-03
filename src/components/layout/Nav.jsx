import { AnimatePresence, m } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useActiveSection } from '../../hooks/useActiveSection';
import { navLinks, meta } from '../../data/portfolio';
import { ease, spring, staggerContainer } from '../../lib/motion';
import './Nav.css';

const SECTION_IDS = ['hero', ...navLinks.map((link) => link.id)];

export default function Nav({ resumeAvailable = false }) {
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  // Lock the page behind the full-screen menu without breaking position:sticky
  // (which a `overflow:hidden` body would do).
  useEffect(() => {
    if (!open) return undefined;
    const { body } = document;
    const previous = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.paddingRight = gap > 0 ? `${gap}px` : previous;
    body.style.overflow = 'hidden';

    return () => {
      body.style.paddingRight = previous;
      body.style.overflow = '';
    };
  }, [open]);

  // Escape to close, and a Tab loop so focus cannot escape the panel.
  useEffect(() => {
    if (!open) return undefined;

    function handleKey(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusables = panelRef.current?.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!open) return;
    const target = panelRef.current?.querySelector('a[href], button:not([disabled])');
    target?.focus();
  }, [open]);

  return (
    <header className="nav">
      <div className="nav__inner shell">
        <a className="nav__brand" href="#hero" aria-label="Moulendra Balaji — back to top">
          <span className="nav__monogram" aria-hidden="true">
            MB
          </span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {navLinks.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="nav__link"
                aria-current={isActive ? 'true' : undefined}
              >
                {isActive && (
                  <m.span layoutId="nav-pill" className="nav__pill" transition={spring.snappy} />
                )}
                <span className="nav__link-label">{link.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="nav__actions">
          {/* Hidden until the PDF actually resolves — see TODO in data/portfolio.js */}
          {resumeAvailable && (
            <a className="btn btn--primary btn--sm nav__resume" href={meta.resume} download>
              Resume
            </a>
          )}
          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="nav-menu"
          >
            <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
            <span className={`nav__burger ${open ? 'is-open' : ''}`} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="nav-menu"
            ref={panelRef}
            className="nav__panel"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease }}
          >
            <m.nav
              className="nav__panel-links"
              aria-label="Mobile"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {navLinks.map((link) => (
                <m.a
                  key={link.id}
                  href={`#${link.id}`}
                  className="nav__panel-link"
                  onClick={close}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } }
                  }}
                >
                  <span className="nav__panel-index" aria-hidden="true">
                    {String(navLinks.indexOf(link) + 1).padStart(2, '0')}
                  </span>
                  {link.label}
                </m.a>
              ))}
              {resumeAvailable && (
                <m.a
                  href={meta.resume}
                  download
                  className="nav__panel-link nav__panel-link--accent"
                  onClick={close}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } }
                  }}
                >
                  <span className="nav__panel-index" aria-hidden="true">
                    ↗
                  </span>
                  Resume
                </m.a>
              )}
            </m.nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}