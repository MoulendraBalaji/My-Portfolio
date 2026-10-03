import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Fonts are bundled locally (latin subset, font-display: swap) rather than
// pulled from a CDN, so there is no third-party connection on first paint.
import './styles/fonts.css';
import './styles/globals.css';
import './components/layout/layout.css';
import './components/ui/ui.css';
import './components/sections/sections.css';
import App from './App.jsx';
import { meta } from './data/portfolio.js';
import { applyMeta } from './lib/meta.js';

applyMeta(meta);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);