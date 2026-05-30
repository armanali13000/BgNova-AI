import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './src/App.jsx';
import ErrorBoundary from './src/components/ErrorBoundary.jsx';
import './src/index.css';

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      ErrorBoundary,
      null,
      React.createElement(
        HashRouter,
        null,
        React.createElement(App),
        React.createElement(Toaster, {
          position: 'top-right',
          toastOptions: {
            style: {
              background: '#111827',
              color: '#f8fafc',
              border: '1px solid rgba(148, 163, 184, 0.22)',
            },
          },
        }),
      ),
    ),
  ),
);
