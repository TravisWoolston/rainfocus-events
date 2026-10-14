import React, { useState, useEffect } from 'react';
import { validateEventForm, WEB_SAFE_COLORS, isValidColor } from '../utils/validation';

export const EventFormModal = ({ isOpen, onClose, onSubmit, initialData = null, title = 'Add Event' }) => {
  const isEditing = !!initialData;

  const defaultFormState = {
    name: '',
    company: '',
    description: '',
    color: 'red',
    customColor: '',
    date: '',
    time: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [useCustomColor, setUseCustomColor] = useState(false);

  // Sync state whenever modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const isStandard = WEB_SAFE_COLORS.includes((initialData.color || '').toLowerCase());
        setFormData({
          name: initialData.name || '',
          company: initialData.company || '',
          description: initialData.description || '',
          color: isStandard ? initialData.color.toLowerCase() : 'other',
          customColor: isStandard ? '' : initialData.color || '',
          date: initialData.date || '',
          time: initialData.time || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          address: initialData.address || '',
          isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        });
        setUseCustomColor(!isStandard && !!initialData.color);
      } else {
        setFormData(defaultFormState);
        setUseCustomColor(false);
      }
      setErrors({});
      setApiError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, initialData]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeEffectiveColor = useCustomColor
    ? formData.customColor.trim()
    : formData.color;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for field once user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (apiError) setApiError(null);
  };

  const handleColorDropdownChange = (e) => {
    const val = e.target.value;
    if (val === 'custom') {
      setUseCustomColor(true);
    } else {
      setUseCustomColor(false);
      setFormData((prev) => ({ ...prev, color: val }));
    }
    if (errors.color) {
      setErrors((prev) => ({ ...prev, color: null }));
    }
  };

  const handleBlur = (field) => {
    const currentPayload = {
      ...formData,
      color: activeEffectiveColor,
    };
    const validationErrors = validateEventForm(currentPayload);
    if (validationErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const payload = {
      name: formData.name.trim(),
      company: formData.company.trim(),
      description: formData.description.trim(),
      color: activeEffectiveColor.toLowerCase(),
      date: formData.date || new Date().toISOString().split('T')[0],
      time: formData.time || '12:00',
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      isActive: formData.isActive,
    };

    // Client-side Input Validation
    const validationErrors = validateEventForm(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmit(payload);
      if (result && !result.success) {
        // API Error encountered
        setApiError(result.error || 'Failed to save event. Please check details and try again.');
      } else {
        onClose();
      }
    } catch (err) {
      setApiError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
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
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          maxWidth: '650px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
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
          <h2 id="modal-title" style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.4rem',
              color: '#64748b',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body / Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* API Error Notification */}
          {apiError && (
            <div
              role="alert"
              style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #f87171',
                borderRadius: '6px',
                padding: '12px',
                color: '#991b1b',
                fontSize: '0.9rem',
              }}
            >
              <strong>API Submission Error: </strong>
              {apiError}
            </div>
          )}

          {/* Row 1: Event Name & Company */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label
                htmlFor="event-name"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}
              >
                Event Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="event-name"
                name="name"
                type="text"
                placeholder="e.g. Annual Tech Summit"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${errors.name ? '#dc2626' : '#cbd5e1'}`,
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.name && (
                <span style={{ display: 'block', color: '#dc2626', fontSize: '0.8rem', marginTop: '4px' }}>
                  {errors.name}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="event-company"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}
              >
                Company <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="event-company"
                name="company"
                type="text"
                placeholder="e.g. GEEKFARM"
                value={formData.company}
                onChange={handleChange}
                onBlur={() => handleBlur('company')}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${errors.company ? '#dc2626' : '#cbd5e1'}`,
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.company && (
                <span style={{ display: 'block', color: '#dc2626', fontSize: '0.8rem', marginTop: '4px' }}>
                  {errors.company}
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Color Selection & Live Preview */}
          <div>
            <label
              htmlFor="event-color-select"
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}
            >
              Theme Color (Web Safe Named Color) <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select
                id="event-color-select"
                value={useCustomColor ? 'custom' : formData.color}
                onChange={handleColorDropdownChange}
                disabled={isSubmitting}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${errors.color ? '#dc2626' : '#cbd5e1'}`,
                  fontSize: '0.9rem',
                  backgroundColor: '#ffffff',
                  flex: 1,
                }}
              >
                {WEB_SAFE_COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)} ({c})
                  </option>
                ))}
                <option value="custom">Other Web Safe Color...</option>
              </select>

              {useCustomColor && (
                <input
                  type="text"
                  placeholder="e.g. goldenrod, indigo"
                  name="customColor"
                  value={formData.customColor}
                  onChange={handleChange}
                  onBlur={() => handleBlur('color')}
                  disabled={isSubmitting}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${errors.color ? '#dc2626' : '#cbd5e1'}`,
                    fontSize: '0.9rem',
                    flex: 1,
                  }}
                />
              )}

              {/* Color swatch live preview */}
              <div
                title={`Preview: ${activeEffectiveColor}`}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '6px',
                  backgroundColor: isValidColor(activeEffectiveColor) ? activeEffectiveColor : '#cbd5e1',
                  border: '2px solid #94a3b8',
                  boxShadow: 'inset 0 0 2px rgba(0,0,0,0.2)',
                  flexShrink: 0,
                }}
              />
            </div>
            {errors.color && (
              <span style={{ display: 'block', color: '#dc2626', fontSize: '0.8rem', marginTop: '4px' }}>
                {errors.color}
              </span>
            )}
          </div>

          {/* Row 3: Description */}
          <div>
            <label
              htmlFor="event-description"
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}
            >
              Description <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea
              id="event-description"
              name="description"
              rows={3}
              placeholder="Provide a detailed description of the event..."
              value={formData.description}
              onChange={handleChange}
              onBlur={() => handleBlur('description')}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: `1px solid ${errors.description ? '#dc2626' : '#cbd5e1'}`,
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
            {errors.description && (
              <span style={{ display: 'block', color: '#dc2626', fontSize: '0.8rem', marginTop: '4px' }}>
                {errors.description}
              </span>
            )}
          </div>

          {/* Optional Details (Collapsible or visible) */}
          <details
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '8px 14px',
              backgroundColor: '#f8fafc',
            }}
          >
            <summary style={{ cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', color: '#475569' }}>
              Additional Event Details (Optional: Date, Time, Contact, Address)
            </summary>
            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label htmlFor="event-date" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#475569', marginBottom: '3px' }}>
                    Date
                  </label>
                  <input
                    id="event-date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label htmlFor="event-time" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#475569', marginBottom: '3px' }}>
                    Time
                  </label>
                  <input
                    id="event-time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label htmlFor="event-email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#475569', marginBottom: '3px' }}>
                    Contact Email
                  </label>
                  <input
                    id="event-email"
                    name="email"
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: `1px solid ${errors.email ? '#dc2626' : '#cbd5e1'}`, fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                  {errors.email && (
                    <span style={{ display: 'block', color: '#dc2626', fontSize: '0.75rem', marginTop: '2px' }}>
                      {errors.email}
                    </span>
                  )}
                </div>
                <div>
                  <label htmlFor="event-phone" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#475569', marginBottom: '3px' }}>
                    Phone
                  </label>
                  <input
                    id="event-phone"
                    name="phone"
                    type="text"
                    placeholder="+1 (800) 555-0199"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="event-address" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#475569', marginBottom: '3px' }}>
                  Location Address
                </label>
                <input
                  id="event-address"
                  name="address"
                  type="text"
                  placeholder="123 Convention Way, City, State"
                  value={formData.address}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#334155' }}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <span>Event is Active</span>
                </label>
              </div>
            </div>
          </details>

          {/* Modal Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '10px',
              paddingTop: '16px',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '8px 18px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isSubmitting ? '#93c5fd' : '#2563eb',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {isSubmitting && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    border: '2px solid #ffffff',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
              )}
              <span>{isSubmitting ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
