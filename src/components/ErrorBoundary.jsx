import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('BgNova AI render error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-screen">
          <div className="glass error-card">
            <p className="eyebrow">Runtime Error</p>
            <h1>BgNova AI could not render</h1>
            <p>{this.state.error.message || 'Open the browser console for the full error.'}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
