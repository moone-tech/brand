// =============================================================================
// client/src/main.tsx — React entry point
// =============================================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { initTheme } from './lib/auth';

// Apply theme before first render to prevent FOUC
initTheme();

const root = document.getElementById('root');
if (!root) throw new Error('#root element not found');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
