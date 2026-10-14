import React, { useState } from 'react';

export const DeleteConfirmModal = ({ isOpen, event, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !event) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const result = await onConfirm(event.id, event.name);
      if (result && !result.success) {
        setError(result.error || 'Failed to delete event.');
      } else {
        onClose();
      }
    } catch (err) {
      setError(err.message || 'An error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 110,
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          maxWidth: '440px',
          width: '100%',
          padding: '24px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <span style={{ fontSize: '1.5rem', color: '#dc2626' }}>🗑️</span>
          <h3 id="delete-dialog-title" style={{ margin: 0, color: '#1e293b', fontSize: '1.2rem' }}>
            Confirm Event Deletion
          </h3>
        </div>

        <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0 0 16px 0', lineHeight: 1.5 }}>
          Are you sure you want to delete <strong>"{event.name}"</strong> (Company:{' '}
          <em>{event.company}</em>)? This action will remove the event from the server.
        </p>

        {error && (
          <div
            role="alert"
            style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #f87171',
              borderRadius: '6px',
              padding: '10px 12px',
              color: '#991b1b',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            <strong>Delete Failed: </strong>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: isDeleting ? '#f87171' : '#dc2626',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isDeleting && (
              <span
                style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  border: '2px solid #ffffff',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
            )}
            <span>{isDeleting ? 'Deleting...' : 'Delete Event'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
