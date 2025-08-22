import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

// Type-safe root element
const container = document.getElementById('root');
if (!container) throw new Error("Root element not found");

const root = createRoot(container);
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
