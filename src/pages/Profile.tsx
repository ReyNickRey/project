import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventContext';
import { User, Mail, Calendar } from 'lucide-react';
import EventCard from '../components/EventCard';
import toast from 'react-hot-toast';

const INTERESTS = ['Sports', 'Academic', 'Arts', 'Music', 'Technology', 'Career', 'Club', 'Other'];

const Profile = () => {
  const { currentUser } = useAuth();
  const { userEvents } = useEvents();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentUser?.interests || []);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setSelectedInterests(currentUser.interests || []);
    }
  }, [currentUser]);
  
  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would update the user profile in the database
    // For now, just show a success message
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };
  
  if (!currentUser) {
    return <div>Loading profile...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-[#5b9bd5] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                {name.charAt(0)}
              </div>
              {!isEditing ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                  <p className="text-gray-600">{currentUser.email}</p>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 py-2 px-4 bg-[#5b9bd5] text-white rounded-md hover:bg-[#4a8ac4] transition-colors text-sm"
                  >
                    Edit Profile
                  </button>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5b9bd5] focus:border-[#5b9bd5]"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-[#5b9bd5] text-white rounded-md hover:bg-[#4a8ac4] transition-colors text-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Profile Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-3 text-[#5b9bd5]" />
                  <span>{name}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3 text-[#5b9bd5]" />
                  <span>{currentUser.email}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-gray-800 mb-3">Interests</h3>
              
              {!isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {selectedInterests.length > 0 ? (
                    selectedInterests.map(interest => (
                      <span 
                        key={interest}
                        className="px-3 py-1 bg-[#5b9bd5] bg-opacity-10 text-[#5b9bd5] text-sm rounded-full"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No interests selected</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        selectedInterests.includes(interest)
                          ? 'bg-[#5b9bd5] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-[#5b9bd5]" />
              My Registered Events
            </h2>
            
            {userEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {userEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't registered for any events yet.</p>
                <a 
                  href="/"
                  className="inline-block py-2 px-4 bg-[#5b9bd5] text-white rounded-md hover:bg-[#4a8ac4] transition-colors"
                >
                  Explore Events
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;