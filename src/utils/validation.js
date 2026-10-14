// Web safe color list according to standard HTML/CSS color specifications
export const WEB_SAFE_COLORS = [
  'red',
  'blue',
  'green',
  'yellow',
  'orange',
  'purple',
  'teal',
  'navy',
  'maroon',
  'olive',
  'lime',
  'aqua',
  'fuchsia',
  'silver',
  'gray',
  'black',
  'coral',
  'gold',
  'indigo',
  'crimson',
];

/**
 * Validates whether a color string is a recognized CSS web safe color name or valid CSS color
 */
export const isValidColor = (color) => {
  if (!color || typeof color !== 'string') return false;
  const normalized = color.trim().toLowerCase();
  if (WEB_SAFE_COLORS.includes(normalized)) return true;

  // Browser check using Option/Image or CSS parser if in DOM environment
  if (typeof window !== 'undefined' && window.Option) {
    const s = new Option().style;
    s.color = normalized;
    return s.color !== '';
  }
  return /^[a-z]+$/i.test(normalized);
};

/**
 * Validates the event form data
 * @param {Object} formData
 * @returns {Object} errors - Map of field name to error message
 */
export const validateEventForm = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Event name is required.';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Event name must be at least 2 characters.';
  } else if (formData.name.trim().length > 100) {
    errors.name = 'Event name cannot exceed 100 characters.';
  }

  // Company validation
  if (!formData.company || !formData.company.trim()) {
    errors.company = 'Company name is required.';
  } else if (formData.company.trim().length < 2) {
    errors.company = 'Company name must be at least 2 characters.';
  }

  // Description validation
  if (!formData.description || !formData.description.trim()) {
    errors.description = 'Description is required.';
  } else if (formData.description.trim().length < 5) {
    errors.description = 'Description must be at least 5 characters.';
  }

  // Color validation (web safe named color)
  if (!formData.color || !formData.color.trim()) {
    errors.color = 'Color is required (e.g. red, blue, green).';
  } else if (!isValidColor(formData.color)) {
    errors.color = 'Please enter a valid web safe named color (e.g., red, teal, navy, green).';
  }

  // Optional Email validation
  if (formData.email && formData.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
  }

  return errors;
};
