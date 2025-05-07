import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Calendar, Clock, MapPin, User, Tag, Users, Share2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getEventById, registerForEvent, unregisterFromEvent } = useEvents();
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [event, setEvent] = useState(id ? getEventById(id) : undefined);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  useEffect(() => {
    if (id) {
      const eventData = getEventById(id);
      if (!eventData) {
        navigate('/');
        toast.error('Event not found');
      } else {
        setEvent(eventData);
        if (currentUser && eventData.attendees?.includes(currentUser.id)) {
          setIsRegistered(true);
        }
      }
    }
  }, [id, getEventById, navigate, currentUser]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading event details...</p>
      </div>
    );
  }

  const handleRegister = async () => {
    try {
      if (!currentUser) {
        toast.error('You must be logged in to register');
        navigate('/login');
        return;
      }
      
      if (!id) return;
      
      await registerForEvent(id);
      setIsRegistered(true);
      
      // Add notification
      addNotification({
        userId: currentUser.id,
        message: `You have registered for ${event.title}`,
        type: 'event',
        read: false,
        relatedEventId: id,
      });
      
      toast.success('Successfully registered for the event!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUnregister = async () => {
    try {
      if (!currentUser || !id) return;
      
      await unregisterFromEvent(id);
      setIsRegistered(false);
      
      // Add notification
      addNotification({
        userId: currentUser.id,
        message: `You have unregistered from ${event.title}`,
        type: 'event',
        read: false,
        relatedEventId: id,
      });
      
      toast.success('Successfully unregistered from the event');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleShare = () => {
    setIsSharing(true);
    
    // Generate the URL to share
    const eventUrl = window.location.href;
    
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
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {event.imageUrl && (
        <div className="h-64 md:h-80 w-full overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-[#5b9bd5] hover:underline mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to events
          </Link>
          
          <button 
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            aria-label="Share event"
          >
            <Share2 className={`h-5 w-5 ${isSharing ? 'text-[#5b9bd5]' : 'text-gray-600'}`} />
          </button>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <p className="text-gray-600 mb-6 whitespace-pre-line">{event.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-3 text-[#5b9bd5] mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Date</h3>
                  <p className="text-gray-600">{event.date}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-[#5b9bd5] mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Time</h3>
                  <p className="text-gray-600">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-[#5b9bd5] mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Location</h3>
                  <p className="text-gray-600">{event.location}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <User className="h-5 w-5 mr-3 text-[#5b9bd5] mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Organizer</h3>
                  <p className="text-gray-600">{event.organizer}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Tag className="h-5 w-5 mr-3 text-[#5b9bd5] mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Category</h3>
                  <p className="text-gray-600">{event.category}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                <Users className="h-5 w-5 mr-2 text-[#5b9bd5]" />
                Attendance
              </h3>
              <p className="text-gray-600">
                {event.attendees ? `${event.attendees.length} registered` : '0 registered'}
              </p>
            </div>
            
            {currentUser ? (
              isRegistered ? (
                <button
                  onClick={handleUnregister}
                  className="w-full py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  Cancel Registration
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  className="w-full py-3 bg-[#5b9bd5] text-white rounded-md hover:bg-[#4a8ac4] transition-colors flex items-center justify-center"
                >
                  Register for Event
                </button>
              )
            ) : (
              <Link
                to="/login"
                className="w-full py-3 bg-[#5b9bd5] text-white rounded-md hover:bg-[#4a8ac4] transition-colors flex items-center justify-center"
              >
                Login to Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;