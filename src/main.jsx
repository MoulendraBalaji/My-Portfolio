import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Fonts are bundled locally (latin subset, font-display: swap) rather than
// pulled from a CDN, so there is no third-party connection on first paint.
import './styles/fonts.css';
import './styles/globals.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);