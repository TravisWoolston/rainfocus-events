import axios from 'axios';

export const BASE_URL = 'https://rf-json-server.herokuapp.com';

export const AVAILABLE_ENDPOINTS = [
  { label: '/events (Default)', path: '/events' },
  { label: '/events-2', path: '/events-2' },
  { label: '/events-3', path: '/events-3' },
  { label: '/events-4', path: '/events-4' },
  { label: '/events-5', path: '/events-5' },
];

// Helper to format Axios errors into user-friendly diagnostic messages
export const parseApiError = (error, actionDescription = 'performing request') => {
  if (error.response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    const status = error.response.status;
    const statusText = error.response.statusText || 'Error';
    if (status === 404) {
      return `Resource not found (404) while ${actionDescription}. It may have been deleted or moved.`;
    }
    if (status >= 500) {
      return `Server error (${status} ${statusText}) while ${actionDescription}. Please try again later.`;
    }
    return `Server responded with ${status} (${statusText}) while ${actionDescription}.`;
  } else if (error.request) {
    // The request was made but no response was received
    return `Network error: No response received from server while ${actionDescription}. Please check your connection or CORS settings.`;
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || `An unexpected error occurred while ${actionDescription}.`;
  }
};

/**
 * Creates an Axios client configured with JSON headers and 15s timeout
 */
export const createClient = () => {
  return axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};

const client = createClient();

/**
 * Fetch all events from specified endpoint
 */
export const getEvents = async (endpoint = '/events', simulateFailure = false) => {
  if (simulateFailure) {
    throw new Error('Simulated API Failure: Unable to fetch events list. [Error demonstration mode]');
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await client.get(cleanEndpoint);
  return response.data;
};

/**
 * Fetch a single event by ID
 */
export const getEventById = async (id, endpoint = '/events', simulateFailure = false) => {
  if (simulateFailure) {
    throw new Error(`Simulated API Failure: Unable to fetch event #${id}. [Error demonstration mode]`);
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await client.get(`${cleanEndpoint}/${id}`);
  return response.data;
};

/**
 * Create a new event
 */
export const createEvent = async (eventData, endpoint = '/events', simulateFailure = false) => {
  if (simulateFailure) {
    throw new Error('Simulated API Failure: Failed to create new event on server. [Error demonstration mode]');
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await client.post(cleanEndpoint, eventData);
  return response.data;
};

/**
 * Update an existing event
 */
export const updateEvent = async (id, eventData, endpoint = '/events', simulateFailure = false) => {
  if (simulateFailure) {
    throw new Error(`Simulated API Failure: Failed to update event #${id}. [Error demonstration mode]`);
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await client.put(`${cleanEndpoint}/${id}`, eventData);
  return response.data;
};

/**
 * Delete an event by ID
 */
export const deleteEvent = async (id, endpoint = '/events', simulateFailure = false) => {
  if (simulateFailure) {
    throw new Error(`Simulated API Failure: Failed to delete event #${id}. [Error demonstration mode]`);
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await client.delete(`${cleanEndpoint}/${id}`);
  return response.data;
};
