import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { Bell, Calendar, AlertCircle, UserPlus, Check, X, ExternalLink } from 'lucide-react';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  
  useEffect(() => {
    // Mark all as read when the component mounts
    markAllAsRead();
  }, [markAllAsRead]);
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-5 w-5 text-[#5b9bd5]" />;
      case 'social':
        return <UserPlus className="h-5 w-5 text-[#5b9bd5]" />;
      case 'system':
      default:
        return <Bell className="h-5 w-5 text-[#5b9bd5]" />;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (notifications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Notifications</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Notifications</h2>
          <p className="text-gray-500">
            You don't have any notifications yet. They'll appear here when you receive them.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
        
        <button
          onClick={markAllAsRead}
          className="py-2 px-4 bg-[#5b9bd5] text-white rounded-md hover:bg-[#4a8ac4] transition-colors text-sm"
        >
          Mark All as Read
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-100">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-4 flex items-start ${!notification.read ? 'bg-blue-50' : 'bg-white'}`}
            >
              <div className="p-2 rounded-full bg-[#5b9bd5] bg-opacity-10 mr-4">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className={`text-gray-800 ${!notification.read ? 'font-medium' : ''}`}>
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-500 ml-1"
                      title="Delete notification"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {formatDate(notification.createdAt)}
                  </span>
                  
                  {notification.relatedEventId && (
                    <Link 
                      to={`/event/${notification.relatedEventId}`}
                      className="text-xs text-[#5b9bd5] font-medium flex items-center hover:underline"
                    >
                      View Event
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;