import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <main
      style={{
        maxWidth: '600px',
        margin: '60px auto',
        padding: '30px',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🧭</div>
      <h1 style={{ margin: '0 0 10px 0', fontSize: '1.75rem', color: '#1e293b' }}>
        404 - Page Not Found
      </h1>
      <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>
        The page or event route you requested does not exist.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          textDecoration: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          fontWeight: '600',
          fontSize: '0.9rem',
        }}
      >
        Return to Events List
      </Link>
    </main>
  );
};
