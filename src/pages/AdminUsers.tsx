import { useState, useEffect } from 'react';
import { Search, Mail, Calendar } from 'lucide-react';
import { useEvents } from '../contexts/EventContext';

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  interests?: string[];
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { events } = useEvents();
  
  useEffect(() => {
    // Get users from localStorage
    const getUsersFromStorage = () => {
      const usersData = localStorage.getItem('school_events_users');
      if (usersData) {
        const parsedUsers = JSON.parse(usersData);
        // Filter out admin users
        return parsedUsers.filter((user: User) => !user.isAdmin);
      }
      return [];
    };
    
    setUsers(getUsersFromStorage());
  }, []);
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get events registered by a user
  const getUserEvents = (userId: string) => {
    return events.filter(event => event.attendees?.includes(userId));
  };
  
  const showUserDetails = (user: User) => {
    setSelectedUser(user);
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Users</h1>
      
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b9bd5]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
              <p className="text-sm text-gray-500">Total: {filteredUsers.length}</p>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div 
                    key={user.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedUser?.id === user.id ? 'bg-[#5b9bd5] bg-opacity-10' : ''
                    }`}
                    onClick={() => showUserDetails(user)}
                  >
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Mail className="h-4 w-4 mr-1 text-gray-400" />
                      {user.email}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No users found
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">{selectedUser.name}</h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-1 text-gray-400" />
                  {selectedUser.email}
                </p>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">User Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500">User ID</p>
                      <p className="font-medium text-gray-900">{selectedUser.id}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="font-medium text-gray-900">Student</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Interests</h3>
                  
                  {selectedUser.interests && selectedUser.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.interests.map(interest => (
                        <span 
                          key={interest}
                          className="px-3 py-1 bg-[#5b9bd5] bg-opacity-10 text-[#5b9bd5] text-sm rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No interests selected</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-[#5b9bd5]" />
                    Registered Events
                  </h3>
                  
                  <div className="space-y-4">
                    {getUserEvents(selectedUser.id).length > 0 ? (
                      getUserEvents(selectedUser.id).map(event => (
                        <div key={event.id} className="bg-gray-50 p-4 rounded-md">
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>{event.date}</span>
                            <span>{event.category}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Not registered for any events</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">
                Select a user to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;