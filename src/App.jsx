import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EventProvider, useEvents } from './context/EventContext';
import { Navbar } from './components/Navbar';
import { EventsListPage } from './pages/EventsListPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { EventFormModal } from './components/EventFormModal';

const AppContent = () => {
  const [isGlobalAddOpen, setIsGlobalAddOpen] = useState(false);
  const { addEvent } = useEvents();

  return (
    <>
      <Navbar onOpenAddModal={() => setIsGlobalAddOpen(true)} />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<EventsListPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* Global Add Event Modal (accessible from top Navbar anytime) */}
      <EventFormModal
        isOpen={isGlobalAddOpen}
        title="Add New Event"
        onClose={() => setIsGlobalAddOpen(false)}
        onSubmit={async (payload) => {
          return await addEvent(payload);
        }}
      />
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <EventProvider>
        <AppContent />
      </EventProvider>
    </BrowserRouter>
  );
}
