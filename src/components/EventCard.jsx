import React from 'react';
import { Link } from 'react-router-dom';

export const EventCard = ({ event, onViewModal, onEdit, onDelete }) => {
  const themeColor = event.color || '#3b82f6';

  return (
    <article
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        borderLeft: `5px solid ${themeColor}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      <div>
        {/* Header: Name, Company, Color badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.15rem',
                color: '#0f172a',
                cursor: 'pointer',
              }}
              onClick={() => onViewModal(event)}
              title="Click to view details in modal"
            >
              {event.name}
            </h3>
            <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '2px', fontWeight: '500' }}>
              Company: <strong style={{ color: '#1e293b' }}>{event.company}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              title={`Color: ${themeColor}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600',
                backgroundColor: '#f1f5f9',
                color: '#334155',
                border: '1px solid #e2e8f0',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: themeColor,
                }}
              />
              {event.color || 'none'}
            </span>
          </div>
        </div>

        {/* Description: Acceptance criteria explicitly says "Display the name, description, company." */}
        <p
          style={{
            margin: '8px 0 16px 0',
            color: '#334155',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.description || 'No description provided.'}
        </p>

        {/* Optional quick details if present */}
        {(event.date || event.time || event.email) && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.8rem',
              color: '#64748b',
              marginBottom: '14px',
              paddingTop: '6px',
              borderTop: '1px dashed #e2e8f0',
            }}
          >
            {event.date && <span>📅 {event.date}</span>}
            {event.time && <span>⏰ {event.time}</span>}
            {event.email && <span>✉️ {event.email}</span>}
          </div>
        )}
      </div>

      {/* Action Buttons: Details Modal, Dedicated Route, Edit, Delete */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Modal View */}
          <button
            type="button"
            onClick={() => onViewModal(event)}
            style={{
              backgroundColor: '#f8fafc',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              padding: '5px 10px',
              fontSize: '0.8rem',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Modal View
          </button>

          {/* React Router Dedicated Page Link */}
          <Link
            to={`/events/${event.id}`}
            style={{
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              borderRadius: '4px',
              padding: '5px 10px',
              fontSize: '0.8rem',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Page ↗
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {/* Edit Event */}
          <button
            type="button"
            onClick={() => onEdit(event)}
            style={{
              backgroundColor: '#f1f5f9',
              color: '#1e293b',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              padding: '5px 10px',
              fontSize: '0.8rem',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Edit
          </button>

          {/* Delete Event */}
          <button
            type="button"
            onClick={() => onDelete(event)}
            style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '4px',
              padding: '5px 10px',
              fontSize: '0.8rem',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};
