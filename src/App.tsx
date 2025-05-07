import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import { NotificationProvider, useNotifications } from './contexts/NotificationContext';
import { sendEmailToUsers } from './utils/email';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminEvents from './pages/AdminEvents';
import AdminUsers from './pages/AdminUsers';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function EventWrapper() {
  const { addNotification } = useNotifications();

  const notifyAllUsers = (message: string, eventId: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('school_events_users') || '[]');
    const emails: string[] = [];
    storedUsers.forEach((user: any) => {
      if (!user.isAdmin && user.email) {
        // Send a notification to each non-admin user
        addNotification({
          userId: user.id,
          message,
          type: 'event',
          read: false,
          relatedEventId: eventId,
        });
        emails.push(user.email);
      }
    });

    // Send an email to all collected email addresses
    sendEmailToUsers(emails, message, eventId)
      .then(() => {
        console.log('Emails sent successfully');
      })
      .catch((error) => {
        console.error('Error sending emails:', error);
      });
  };

  return (
    <EventProvider onEventUpdate={notifyAllUsers}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/calendar" element={<Calendar />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>
          </Route>
          
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </EventProvider>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f4e3] flex items-center justify-center">
        <div className="animate-pulse text-[#5b9bd5] text-2xl font-bold">
          Loading School Events...
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        <EventWrapper />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;