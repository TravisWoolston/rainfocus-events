import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  parseApiError,
  AVAILABLE_ENDPOINTS,
} from '../api/eventsApi';

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

// Sort helper: sorts by company name alphabetically (case-insensitive)
const sortByCompany = (list, direction = 'asc') => {
  return [...list].sort((a, b) => {
    const compA = (a.company || '').trim().toLowerCase();
    const compB = (b.company || '').trim().toLowerCase();
    const cmp = compA.localeCompare(compB);
    return direction === 'asc' ? cmp : -cmp;
  });
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeEndpoint, setActiveEndpoint] = useState('/events');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [sortDirection, setSortDirection] = useState('asc'); // default 'asc'
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === msg ? null : curr));
    }, 5000);
  };

  const clearNotification = () => setNotification(null);

  // Load events from the active endpoint
  const loadEvents = useCallback(async (customEndpoint = activeEndpoint, shouldSimulate = simulateFailure) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents(customEndpoint, shouldSimulate);
      const list = Array.isArray(data) ? data : [];
      // Requirement: Sort by company name after loading
      const sorted = sortByCompany(list, sortDirection);
      setEvents(sorted);
    } catch (err) {
      console.error('Error fetching events:', err);
      const parsed = parseApiError(err, 'fetching events list');
      setError(parsed);
    } finally {
      setLoading(false);
    }
  }, [activeEndpoint, simulateFailure, sortDirection]);

  // Initial load or endpoint change
  useEffect(() => {
    loadEvents(activeEndpoint, simulateFailure);
  }, [activeEndpoint, loadEvents]);

  // Handle re-sorting when direction changes
  const toggleSortDirection = () => {
    const nextDir = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(nextDir);
    setEvents((prev) => sortByCompany(prev, nextDir));
  };

  // Add event
  const handleAddEvent = async (newEventData) => {
    setLoading(true);
    try {
      const created = await createEvent(newEventData, activeEndpoint, simulateFailure);
      showNotification(`Event "${created.name || 'New Event'}" added successfully!`);
      // Update list after addition and ensure sorted by company
      setEvents((prev) => sortByCompany([...prev, created], sortDirection));
      return { success: true, data: created };
    } catch (err) {
      console.error('Error adding event:', err);
      const parsed = parseApiError(err, 'creating event');
      return { success: false, error: parsed };
    } finally {
      setLoading(false);
    }
  };

  // Update event
  const handleUpdateEvent = async (id, updatedData) => {
    setLoading(true);
    try {
      const result = await updateEvent(id, updatedData, activeEndpoint, simulateFailure);
      showNotification(`Event "${result.name || 'Event'}" updated successfully!`);
      // Update event in list and keep sorted
      setEvents((prev) =>
        sortByCompany(
          prev.map((item) => (String(item.id) === String(id) ? { ...item, ...result } : item)),
          sortDirection
        )
      );
      return { success: true, data: result };
    } catch (err) {
      console.error('Error updating event:', err);
      const parsed = parseApiError(err, `updating event #${id}`);
      return { success: false, error: parsed };
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async (id, eventName = 'Event') => {
    setLoading(true);
    try {
      await deleteEvent(id, activeEndpoint, simulateFailure);
      showNotification(`Event "${eventName}" deleted successfully!`);
      // Remove from list after deletion
      setEvents((prev) => prev.filter((item) => String(item.id) !== String(id)));
      return { success: true };
    } catch (err) {
      console.error('Error deleting event:', err);
      const parsed = parseApiError(err, `deleting event #${id}`);
      return { success: false, error: parsed };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    events,
    loading,
    error,
    setError,
    activeEndpoint,
    setActiveEndpoint,
    simulateFailure,
    setSimulateFailure,
    sortDirection,
    toggleSortDirection,
    loadEvents,
    addEvent: handleAddEvent,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent,
    notification,
    clearNotification,
    availableEndpoints: AVAILABLE_ENDPOINTS,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
