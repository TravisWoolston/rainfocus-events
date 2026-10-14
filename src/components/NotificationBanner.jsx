import React from 'react';

export const NotificationBanner = ({ notification, onDismiss }) => {
  if (!notification || !notification.message) return null;

  const isSuccess = notification.type === 'success';

  return (
    <div
      role="status"
      style={{
        backgroundColor: isSuccess ? '#dcfce7' : '#e0f2fe',
        border: `1px solid ${isSuccess ? '#22c55e' : '#38bdf8'}`,
        color: isSuccess ? '#15803d' : '#0369a1',
        borderRadius: '6px',
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.9rem',
        fontWeight: '500',
        animation: 'fadeIn 0.2s ease-in-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{isSuccess ? '✓' : 'ℹ️'}</span>
        <span>{notification.message}</span>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Close notification"
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          fontWeight: 'bold',
          padding: '0 4px',
        }}
      >
        ✕
      </button>
    </div>
  );
};
