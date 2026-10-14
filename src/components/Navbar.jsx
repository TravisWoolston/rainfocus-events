import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

export const Navbar = ({ onOpenAddModal }) => {
  const {
    activeEndpoint,
    setActiveEndpoint,
    simulateFailure,
    setSimulateFailure,
    availableEndpoints,
  } = useEvents();

  const location = useLocation();

  return (
    <header
      style={{
        backgroundColor: '#1e293b',
        color: '#ffffff',
        padding: '14px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to="/"
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '1.25rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>📅</span>
            <span>RainFocus Events</span>
          </Link>
          <nav style={{ display: 'flex', gap: '12px' }}>
            <Link
              to="/"
              style={{
                color: location.pathname === '/' ? '#60a5fa' : '#cbd5e1',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: location.pathname === '/' ? '600' : '400',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: location.pathname === '/' ? '#334155' : 'transparent',
              }}
            >
              All Events
            </Link>
          </nav>
        </div>

        {/* Controls: Endpoint Selector, Error Simulation Toggle, Add Event Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          {/* Endpoint selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label
              htmlFor="api-endpoint-select"
              style={{ fontSize: '0.825rem', color: '#94a3b8', fontWeight: '500' }}
            >
              Endpoint:
            </label>
            <select
              id="api-endpoint-select"
              value={activeEndpoint}
              onChange={(e) => setActiveEndpoint(e.target.value)}
              style={{
                backgroundColor: '#334155',
                color: '#f8fafc',
                border: '1px solid #475569',
                borderRadius: '4px',
                padding: '6px 10px',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {availableEndpoints.map((ep) => (
                <option key={ep.path} value={ep.path}>
                  {ep.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error handling simulation toggle */}
          <label
            title="Toggle to test API failure error handling methodologies"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: simulateFailure ? '#7f1d1d' : '#334155',
              border: `1px solid ${simulateFailure ? '#ef4444' : '#475569'}`,
              borderRadius: '4px',
              padding: '5px 10px',
              fontSize: '0.825rem',
              cursor: 'pointer',
              color: simulateFailure ? '#fecaca' : '#cbd5e1',
              transition: 'all 0.2s ease',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span>Simulate API Error</span>
          </label>

          {/* Add Event Button */}
          {onOpenAddModal && (
            <button
              type="button"
              onClick={onOpenAddModal}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '7px 16px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              <span>＋</span>
              <span>New Event</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
