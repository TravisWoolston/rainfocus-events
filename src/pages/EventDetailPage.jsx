import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEventById, parseApiError } from '../api/eventsApi';
import { useEvents } from '../context/EventContext';
import { EventFormModal } from '../components/EventFormModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { ErrorMessage } from '../components/ErrorMessage';

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeEndpoint, simulateFailure, updateEvent, deleteEvent } = useEvents();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load individual event by ID
  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEventById(id, activeEndpoint, simulateFailure);
      setEvent(data);
    } catch (err) {
      console.error(`Error loading event ${id}:`, err);
      setError(parseApiError(err, `loading event #${id}`));
    } finally {
      setLoading(false);
    }
  }, [id, activeEndpoint, simulateFailure]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 16px' }}>
      {/* Back to Events Navigation */}
      <div style={{ marginBottom: '20px' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#2563eb',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '600',
          }}
        >
          ← Back to Events List
        </Link>
      </div>

      {/* Error Message with Retry */}
      <ErrorMessage
        message={error}
        onRetry={fetchEvent}
        onDismiss={() => setError(null)}
      />

      {/* Loading Indicator */}
      {loading && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '50px 20px',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              width: '36px',
              height: '36px',
              border: '3px solid #cbd5e1',
              borderTopColor: '#2563eb',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              marginBottom: '12px',
            }}
          />
          <h3 style={{ margin: '0 0 4px 0', color: '#1e293b' }}>Loading Event #{id}...</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
            Retrieving single event record via GET {activeEndpoint}/{id}
          </p>
        </div>
      )}

      {/* Event Details Card */}
      {!loading && event && (
        <article
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            borderTop: `6px solid ${event.color || '#2563eb'}`,
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Card Header */}
          <div
            style={{
              padding: '24px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#0f172a' }}>
                  {event.name}
                </h1>
                {event.isActive !== undefined && (
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      backgroundColor: event.isActive ? '#dcfce7' : '#f1f5f9',
                      color: event.isActive ? '#15803d' : '#64748b',
                    }}
                  >
                    {event.isActive ? 'Active' : 'Inactive'}
                  </span>
                )}
              </div>
              <div style={{ marginTop: '6px', fontSize: '1.05rem', color: '#475569' }}>
                Company:{' '}
                <strong style={{ color: '#1e293b', fontSize: '1.1rem' }}>
                  {event.company}
                </strong>
              </div>
            </div>

            {/* Actions: Edit & Delete */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#1e293b',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                ✏️ Edit Event
              </button>
              <button
                type="button"
                onClick={() => setIsDeleting(true)}
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  border: '1px solid #fca5a5',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                🗑️ Delete Event
              </button>
            </div>
          </div>

          {/* Description Section */}
          <div style={{ padding: '24px' }}>
            <h2
              style={{
                fontSize: '1rem',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 10px 0',
              }}
            >
              Event Description
            </h2>
            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '16px 20px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                color: '#334155',
                fontSize: '1rem',
                lineHeight: 1.6,
              }}
            >
              {event.description}
            </div>

            {/* Event Metadata Breakdown */}
            <div
              style={{
                marginTop: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  padding: '14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Color Theme</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: event.color || 'gray',
                      border: '1px solid rgba(0,0,0,0.2)',
                    }}
                  />
                  <strong style={{ color: '#1e293b', fontSize: '0.95rem' }}>
                    {event.color}
                  </strong>
                </div>
              </div>

              {event.date && (
                <div
                  style={{
                    padding: '14px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Date</div>
                  <strong style={{ display: 'block', marginTop: '4px', color: '#1e293b' }}>
                    📅 {event.date}
                  </strong>
                </div>
              )}

              {event.time && (
                <div
                  style={{
                    padding: '14px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Time</div>
                  <strong style={{ display: 'block', marginTop: '4px', color: '#1e293b' }}>
                    ⏰ {event.time}
                  </strong>
                </div>
              )}

              {event.email && (
                <div
                  style={{
                    padding: '14px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Contact Email</div>
                  <a
                    href={`mailto:${event.email}`}
                    style={{ display: 'block', marginTop: '4px', color: '#2563eb', textDecoration: 'none' }}
                  >
                    ✉️ {event.email}
                  </a>
                </div>
              )}

              {event.phone && (
                <div
                  style={{
                    padding: '14px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Phone Number</div>
                  <strong style={{ display: 'block', marginTop: '4px', color: '#1e293b' }}>
                    📞 {event.phone}
                  </strong>
                </div>
              )}

              {event.address && (
                <div
                  style={{
                    padding: '14px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    gridColumn: '1 / -1',
                  }}
                >
                  <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Location Address</div>
                  <strong style={{ display: 'block', marginTop: '4px', color: '#1e293b' }}>
                    📍 {event.address}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </article>
      )}

      {/* Edit Modal */}
      {isEditing && event && (
        <EventFormModal
          isOpen={isEditing}
          title={`Edit Event: ${event.name}`}
          initialData={event}
          onClose={() => setIsEditing(false)}
          onSubmit={async (payload) => {
            const result = await updateEvent(event.id, payload);
            if (result && result.success) {
              setEvent(result.data);
            }
            return result;
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && event && (
        <DeleteConfirmModal
          isOpen={isDeleting}
          event={event}
          onClose={() => setIsDeleting(false)}
          onConfirm={async (eventId, eventName) => {
            const res = await deleteEvent(eventId, eventName);
            if (res && res.success) {
              navigate('/');
            }
            return res;
          }}
        />
      )}
    </main>
  );
};
