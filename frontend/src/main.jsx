import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Register service worker for PWA capabilities
// Only register in production or when sw.js exists
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  import('./services/swRegistration.js').then(({ registerServiceWorker }) => {
    registerServiceWorker();
  }).catch((err) => {
    console.warn('Service worker registration skipped:', err);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
