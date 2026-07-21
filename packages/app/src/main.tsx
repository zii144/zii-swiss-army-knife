import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
// Design system — layered stylesheet. Order matters: tokens first (declares
// the @layer cascade order), then base chrome, then components. See
// styles/tokens.css and docs/tech/07-design-system.md.
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

const container = document.getElementById('root');
if (container === null) {
  throw new Error('Root element #root not found');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register the hand-rolled service worker (PWA app shell). Guarded for
// environments without service-worker support (e.g. SSR or older browsers).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Registration failures are non-fatal; the app still works online.
    });
  });
}
