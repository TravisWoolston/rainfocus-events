import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEventById, parseApiError } from '../api/eventsApi';
import { useEvents } from '../context/EventContext';

export const EventDetailModal = ({ isOpen, eventId, initialEvent, onClose, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { activeEndpoint, simulateFailure } = useEvents();

  const [event, setEvent] = useState(initialEvent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch single event if eventId provided or to ensure fresh data
  useEffect(() => {
    if (isOpen && eventId) {
      let isMounted = true;
      setLoading(true);
      setError(null);

      getEventById(eventId, activeEndpoint, simulateFailure)
        .then((data) => {
          if (isMounted) setEvent(data);
        })
        .catch((err) => {
          if (isMounted) {
            console.error('Error fetching event details in modal:', err);
            // Fallback to initialEvent if available, but show warning banner
            if (initialEvent) {
              setEvent(initialEvent);
            }
            setError(parseApiError(err, `loading event #${eventId}`));
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });

      return () => {
        isMounted = false;
      };
    } else if (isOpen && initialEvent) {
      setEvent(initialEvent);
    }
  }, [isOpen, eventId, activeEndpoint, simulateFailure, initialEvent]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
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
        zIndex: 100,
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.25rem' }}>📄</span>
            <h2 id="detail-modal-title" style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>
              Event Details (Modal View)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.4rem',
              color: '#64748b',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          {error && (
            <div
              style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #f87171',
                borderRadius: '6px',
                padding: '10px 14px',
                marginBottom: '16px',
                color: '#991b1b',
                fontSize: '0.875rem',
              }}
            >
              <strong>API Warning: </strong>
              {error}
            </div>
          )}

          {loading && !event ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
              <div
                style={{
                  display: 'inline-block',
                  width: '28px',
                  height: '28px',
                  border: '3px solid #cbd5e1',
                  borderTopColor: '#2563eb',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  marginBottom: '10px',
                }}
              />
              <p style={{ margin: 0 }}>Loading event details from server...</p>
            </div>
          ) : event ? (
            <div>
              {/* Event Name & Company Banner */}
              <div
                style={{
                  borderLeft: `6px solid ${event.color || '#3b82f6'}`,
                  paddingLeft: '14px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.35rem', color: '#0f172a' }}>
                    {event.name}
                  </h3>
                  {event.isActive !== undefined && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: event.isActive ? '#dcfce7' : '#f1f5f9',
                        color: event.isActive ? '#166534' : '#64748b',
                      }}
                    >
                      {event.isActive ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </div>
                <div style={{ color: '#475569', fontSize: '0.95rem', fontWeight: '500' }}>
                  Company: <strong style={{ color: '#1e293b' }}>{event.company}</strong>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.875rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Description
                </h4>
                <p
                  style={{
                    margin: 0,
                    lineHeight: 1.6,
                    color: '#334155',
                    fontSize: '0.95rem',
                    backgroundColor: '#f8fafc',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {event.description || 'No description provided.'}
                </p>
              </div>

              {/* Metadata Attributes */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '12px',
                  backgroundColor: '#f1f5f9',
                  padding: '14px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Theme Color:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: event.color || 'gray',
                        border: '1px solid rgba(0,0,0,0.2)',
                      }}
                    />
                    <strong style={{ color: '#1e293b' }}>{event.color || 'None'}</strong>
                  </div>
                </div>

                {event.date && (
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Date:</span>
                    <strong style={{ color: '#1e293b' }}>{event.date}</strong>
                  </div>
                )}

                {event.time && (
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Time:</span>
                    <strong style={{ color: '#1e293b' }}>{event.time}</strong>
                  </div>
                )}

                {event.email && (
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Email:</span>
                    <a href={`mailto:${event.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                      {event.email}
                    </a>
                  </div>
                )}

                {event.phone && (
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Phone:</span>
                    <strong style={{ color: '#1e293b' }}>{event.phone}</strong>
                  </div>
                )}

                {event.address && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ color: '#64748b', display: 'block' }}>Location:</span>
                    <strong style={{ color: '#1e293b' }}>{event.address}</strong>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p style={{ color: '#64748b' }}>No event data found.</p>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          {event && (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`/events/${event.id}`);
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#2563eb',
                border: '1px solid #93c5fd',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Open Dedicated Route (react-router) ↗
            </button>
          )}

          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            {event && onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(event);
                }}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
            )}

            {event && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(event);
                }}
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  border: '1px solid #fca5a5',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: '#334155',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 16px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
