import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  organizer: string;
  createdBy: string;
  imageUrl: string;
  attendees?: string[];
};

type EventContextType = {
  events: Event[];
  userEvents: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdBy' | 'attendees'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  registerForEvent: (eventId: string) => Promise<void>;
  unregisterFromEvent: (eventId: string) => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  loading: boolean;
  error: string | null;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

const EVENTS_STORAGE_KEY = 'school_events_data';

type EventProviderProps = {
  children: ReactNode;
  onEventUpdate: (message: string, eventId: string) => void;
};

export const EventProvider = ({ children, onEventUpdate }: EventProviderProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const savedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
    setLoading(false);
  }, []);

  const saveEvents = (updatedEvents: Event[]) => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const userEvents = events.filter(event => 
    currentUser && event.attendees?.includes(currentUser.id)
  );

  const addEvent = async (event: Omit<Event, 'id' | 'createdBy' | 'attendees'>) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to create an event');
      }
      
      const newEvent: Event = {
        ...event,
        id: `event-${Date.now()}`,
        createdBy: currentUser.id,
        attendees: [],
      };
      
      const updatedEvents = [...events, newEvent];
      saveEvents(updatedEvents);

      // Notify all users about the new event
      onEventUpdate(`New event created: ${event.title}`, newEvent.id);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: string, eventUpdates: Partial<Event>) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to update an event');
      }
      
      const eventIndex = events.findIndex(e => e.id === id);
      
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }
      
      const event = events[eventIndex];
      
      if (!currentUser.isAdmin && event.createdBy !== currentUser.id) {
        throw new Error('You do not have permission to update this event');
      }
      
      const updatedEvent = { ...event, ...eventUpdates };
      const updatedEvents = [...events];
      updatedEvents[eventIndex] = updatedEvent;
      
      saveEvents(updatedEvents);

      // Notify all users about the event update
      onEventUpdate(`Event updated: ${updatedEvent.title}`, id);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to delete an event');
      }
      
      const event = events.find(e => e.id === id);
      
      if (!event) {
        throw new Error('Event not found');
      }
      
      if (!currentUser.isAdmin && event.createdBy !== currentUser.id) {
        throw new Error('You do not have permission to delete this event');
      }
      
      const updatedEvents = events.filter(e => e.id !== id);
      saveEvents(updatedEvents);

      // Notify all users about the event deletion
      onEventUpdate(`Event deleted: ${event.title}`, id);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async (eventId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to register for an event');
      }
      
      const eventIndex = events.findIndex(e => e.id === eventId);
      
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }
      
      const event = events[eventIndex];
      
      if (event.attendees?.includes(currentUser.id)) {
        throw new Error('You are already registered for this event');
      }
      
      const updatedEvent = {
        ...event,
        attendees: [...(event.attendees || []), currentUser.id],
      };
      
      const updatedEvents = [...events];
      updatedEvents[eventIndex] = updatedEvent;
      
      saveEvents(updatedEvents);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unregisterFromEvent = async (eventId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to unregister from an event');
      }
      
      const eventIndex = events.findIndex(e => e.id === eventId);
      
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }
      
      const event = events[eventIndex];
      
      if (!event.attendees?.includes(currentUser.id)) {
        throw new Error('You are not registered for this event');
      }
      
      const updatedEvent = {
        ...event,
        attendees: event.attendees.filter(id => id !== currentUser.id),
      };
      
      const updatedEvents = [...events];
      updatedEvents[eventIndex] = updatedEvent;
      
      saveEvents(updatedEvents);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  const value = {
    events,
    userEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    getEventById,
    loading,
    error,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};