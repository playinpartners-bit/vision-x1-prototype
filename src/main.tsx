import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AppStateProvider } from './hooks/AppState';
import { App } from './App';
import './styles/global.css';

// HashRouter keeps deep links working on any static host (GitHub Pages,
// S3, Netlify drop) with zero server config — ideal for demoing.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* useTransitions={false}: apply URL changes synchronously. By default React Router wraps
        them in startTransition, which can leave the previous page on screen after the URL has
        already changed (reported on the Vercel deployment). */}
    <HashRouter useTransitions={false}>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </HashRouter>
  </StrictMode>,
);
