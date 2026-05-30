import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111827',
              color: '#f8fafc',
              border: '1px solid rgba(148, 163, 184, 0.22)',
            },
          }}
        />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
