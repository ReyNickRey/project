import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type Notification = {
  id: string;
  userId: string;
  message: string;
  type: 'event' | 'system' | 'social';
  read: boolean;
  createdAt: string;
  relatedEventId?: string;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  loading: boolean;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock storage
const NOTIFICATIONS_STORAGE_KEY = 'school_events_notifications';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Initialize notifications
  useEffect(() => {
    const loadNotifications = () => {
      const savedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      
      if (!savedNotifications) {
        // Create initial notifications
        const initialNotifications = [
          {
            id: 'notif-1',
            userId: 'user-1',
            message: 'Welcome to School Events App!',
            type: 'system',
            read: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'notif-2',
            userId: 'user-1',
            message: 'You have registered for the Annual Science Fair',
            type: 'event',
            read: false,
            createdAt: new Date().toISOString(),
            relatedEventId: 'event-1',
          },
          {
            id: 'notif-3',
            userId: 'user-1',
            message: 'You have registered for the Music Concert',
            type: 'event',
            read: false,
            createdAt: new Date().toISOString(),
            relatedEventId: 'event-3',
          },
        ];
        
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(initialNotifications));
        setNotifications(initialNotifications);
      } else {
        setNotifications(JSON.parse(savedNotifications));
      }
      
      setLoading(false);
    };

    loadNotifications();
  }, []);

  // Filter notifications for current user
  const userNotifications = notifications.filter(
    notif => currentUser && notif.userId === currentUser.id
  );

  const unreadCount = userNotifications.filter(notif => !notif.read).length;

  const saveNotifications = (updatedNotifications: Notification[]) => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedNotifications = [...notifications, newNotification];
    saveNotifications(updatedNotifications);
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    );
    
    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    if (!currentUser) return;
    
    const updatedNotifications = notifications.map(notif => 
      notif.userId === currentUser.id ? { ...notif, read: true } : notif
    );
    
    saveNotifications(updatedNotifications);
  };

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== id);
    saveNotifications(updatedNotifications);
  };

  const value = {
    notifications: userNotifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loading,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};