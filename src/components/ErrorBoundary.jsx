import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: '#FFFCF9',
        }}>
          <div style={{
            maxWidth: '500px',
            padding: '2rem',
            border: '2px solid #111111',
            backgroundColor: '#FFFFFF',
          }}>
            <h2 style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: '1.5rem',
              margin: '0 0 1rem 0',
              color: '#8B1A0A',
            }}>
              Something went wrong
            </h2>
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.9rem',
              color: '#5F5F5F',
              margin: '0 0 1.5rem 0',
            }}>
              The dashboard encountered an unexpected error. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                border: '2px solid #111111',
                backgroundColor: '#F18B25',
                color: '#111111',
                padding: '0.75rem 1.5rem',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;