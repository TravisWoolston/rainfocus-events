import React, { useState, useMemo } from 'react';
import { useEvents } from '../context/EventContext';
import { EventCard } from '../components/EventCard';
import { EventFormModal } from '../components/EventFormModal';
import { EventDetailModal } from '../components/EventDetailModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { ErrorMessage } from '../components/ErrorMessage';
import { NotificationBanner } from '../components/NotificationBanner';

export const EventsListPage = () => {
  const {
    events,
    loading,
    error,
    setError,
    loadEvents,
    sortDirection,
    toggleSortDirection,
    addEvent,
    updateEvent,
    deleteEvent,
    notification,
    clearNotification,
  } = useEvents();

  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [detailModalEvent, setDetailModalEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);

  // Filtered events based on search term
  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return events;
    const term = searchTerm.toLowerCase();
    return events.filter(
      (ev) =>
        (ev.name && ev.name.toLowerCase().includes(term)) ||
        (ev.company && ev.company.toLowerCase().includes(term)) ||
        (ev.description && ev.description.toLowerCase().includes(term))
    );
  }, [events, searchTerm]);

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Toast Notification */}
      <NotificationBanner notification={notification} onDismiss={clearNotification} />

      {/* API Error Banner with Retry functionality */}
      <ErrorMessage
        message={error}
        onRetry={() => loadEvents()}
        onDismiss={() => setError(null)}
      />

      {/* Control Bar: Search, Sort by Company Info, Refresh, Add Button */}
      <section
        aria-label="Event Controls"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '24px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '240px', flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search by name, company, or text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Info & Toggle (Requirement: Sort by company name after loading) */}
          <button
            type="button"
            onClick={toggleSortDirection}
            title="Click to toggle company sort order"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '0.85rem',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            <span>Sorted by Company:</span>
            <strong style={{ color: '#2563eb' }}>
              {sortDirection === 'asc' ? 'A → Z ↑' : 'Z → A ↓'}
            </strong>
          </button>

          {/* Refresh / Reload from API */}
          <button
            type="button"
            onClick={() => loadEvents()}
            disabled={loading}
            title="Reload events from API"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '0.85rem',
              color: '#334155',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <span>🔄</span>
            <span>{loading ? 'Fetching...' : 'Reload API'}</span>
          </button>
        </div>

        {/* Primary Add Event Button */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '9px 18px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          <span>＋ Add Event</span>
        </button>
      </section>

      {/* Events Summary Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          color: '#64748b',
          fontSize: '0.875rem',
        }}
      >
        <span>
          Showing <strong>{filteredEvents.length}</strong> {filteredEvents.length === 1 ? 'event' : 'events'}
          {searchTerm && ` (filtered from ${events.length})`}
        </span>
        <span style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
          * Events automatically sorted by company name after loading
        </span>
      </div>

      {/* Loading State */}
      {loading && events.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
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
          <h3 style={{ margin: '0 0 6px 0', color: '#1e293b' }}>Loading Events...</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
            Fetching event records from API server...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredEvents.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '50px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px dashed #cbd5e1',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
          <h3 style={{ margin: '0 0 6px 0', color: '#1e293b' }}>
            {searchTerm ? 'No matching events found' : 'No events found'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>
            {searchTerm
              ? `No events matched your search "${searchTerm}".`
              : 'There are currently no events loaded from this endpoint.'}
          </p>
          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{
                backgroundColor: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                padding: '6px 14px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Clear Search
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Create the First Event
            </button>
          )}
        </div>
      )}

      {/* Events Grid */}
      <section
        aria-label="Events Grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
        }}
      >
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onViewModal={(ev) => setDetailModalEvent(ev)}
            onEdit={(ev) => setEditingEvent(ev)}
            onDelete={(ev) => setDeletingEvent(ev)}
          />
        ))}
      </section>

      {/* Add Event Modal */}
      <EventFormModal
        isOpen={isAddModalOpen}
        title="Add New Event"
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (payload) => {
          return await addEvent(payload);
        }}
      />

      {/* Edit Event Modal */}
      <EventFormModal
        isOpen={!!editingEvent}
        title={`Edit Event: ${editingEvent?.name || ''}`}
        initialData={editingEvent}
        onClose={() => setEditingEvent(null)}
        onSubmit={async (payload) => {
          if (!editingEvent) return;
          return await updateEvent(editingEvent.id, payload);
        }}
      />

      {/* View Event Detail Modal */}
      <EventDetailModal
        isOpen={!!detailModalEvent}
        eventId={detailModalEvent?.id}
        initialEvent={detailModalEvent}
        onClose={() => setDetailModalEvent(null)}
        onEdit={(ev) => setEditingEvent(ev)}
        onDelete={(ev) => setDeletingEvent(ev)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingEvent}
        event={deletingEvent}
        onClose={() => setDeletingEvent(null)}
        onConfirm={async (id, name) => {
          return await deleteEvent(id, name);
        }}
      />
    </main>
  );
};
