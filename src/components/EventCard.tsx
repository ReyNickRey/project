import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, User, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents, Event } from '../contexts/EventContext';
import { useNotifications } from '../contexts/NotificationContext';
import toast from 'react-hot-toast';

type EventCardProps = {
  event: Event;
};

const EventCard = ({ event }: EventCardProps) => {
  const { currentUser } = useAuth();
  const { registerForEvent, unregisterFromEvent } = useEvents();
  const { addNotification } = useNotifications();
  
  const isRegistered = currentUser && event.attendees?.includes(currentUser.id);
  
  const [isSharing, setIsSharing] = useState(false);
  
  const handleRegister = async () => {
    try {
      if (!currentUser) {
        toast.error('You must be logged in to register for events');
        return;
      }
      
      await registerForEvent(event.id);
      
      // Add notification
      addNotification({
        userId: currentUser.id,
        message: `You have registered for ${event.title}`,
        type: 'event',
        read: false,
        relatedEventId: event.id,
      });
      
      toast.success('Successfully registered for the event!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  
  const handleUnregister = async () => {
    try {
      if (!currentUser) return;
      
      await unregisterFromEvent(event.id);
      
      // Add notification
      addNotification({
        userId: currentUser.id,
        message: `You have unregistered from ${event.title}`,
        type: 'event',
        read: false,
        relatedEventId: event.id,
      });
      
      toast.success('Successfully unregistered from the event');
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  
  const handleShare = () => {
    setIsSharing(true);
    
    // Generate the URL to share
    const eventUrl = `${window.location.origin}/event/${event.id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(eventUrl)
      .then(() => {
        toast.success('Event link copied to clipboard!');
        setTimeout(() => setIsSharing(false), 1000);
      })
      .catch(() => {
        toast.error('Failed to copy link');
        setIsSharing(false);
      });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
      {event.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
            {event.title}
          </h3>
          
          <button 
            onClick={handleShare}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
            aria-label="Share event"
          >
            <Share2 className={`h-5 w-5 ${isSharing ? 'text-[#5b9bd5]' : 'text-gray-600'}`} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-[#5b9bd5]" />
            <span>{event.date}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-[#5b9bd5]" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-[#5b9bd5]" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-[#5b9bd5]" />
            <span>{event.organizer}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Link 
            to={`/event/${event.id}`}
            className="text-[#5b9bd5] hover:underline font-medium text-sm"
          >
            View Details
          </Link>
          
          {currentUser && (
            isRegistered ? (
              <button
                onClick={handleUnregister}
                className="py-1 px-3 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
              >
                Unregister
              </button>
            ) : (
              <button
                onClick={handleRegister}
                className="py-1 px-3 bg-[#5b9bd5] text-white text-sm rounded-md hover:bg-[#4a8ac4] transition-colors"
              >
                Register
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;