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
    <HashRouter>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </HashRouter>
  </StrictMode>,
);
