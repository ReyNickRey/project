import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import { Calendar, Users, UserCheck, PlusCircle } from 'lucide-react';

// Mock function to get users from localStorage
const getUsers = () => {
  const usersData = localStorage.getItem('school_events_users');
  return usersData ? JSON.parse(usersData) : [];
};

const AdminDashboard = () => {
  const { events } = useEvents();
  const [users, setUsers] = useState<any[]>([]);
  
  useEffect(() => {
    // Get users from localStorage
    const userData = getUsers();
    setUsers(userData.filter((user: any) => !user.isAdmin));
  }, []);
  
  // Calculate stats
  const totalEvents = events.length;
  const totalUsers = users.length;
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate >= today;
  }).length;
  
  // Group events by category
  const eventsByCategory = events.reduce((acc: { [key: string]: number }, event) => {
    const { category } = event;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {});
  
  // Sort categories by count
  const sortedCategories = Object.entries(eventsByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        
        <Link
          to="/admin/events"
          className="py-2 px-4 bg-[#5b9bd5] text-white rounded-md hover:bg-[#4a8ac4] transition-colors flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create Event
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Total Events</h2>
            <div className="p-3 bg-[#5b9bd5] bg-opacity-10 rounded-full">
              <Calendar className="h-6 w-6 text-[#5b9bd5]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalEvents}</p>
          <Link to="/admin/events" className="text-sm text-[#5b9bd5] hover:underline mt-2 inline-block">
            Manage Events
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Total Users</h2>
            <div className="p-3 bg-[#5b9bd5] bg-opacity-10 rounded-full">
              <Users className="h-6 w-6 text-[#5b9bd5]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
          <Link to="/admin/users" className="text-sm text-[#5b9bd5] hover:underline mt-2 inline-block">
            View Users
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Events</h2>
            <div className="p-3 bg-[#5b9bd5] bg-opacity-10 rounded-full">
              <UserCheck className="h-6 w-6 text-[#5b9bd5]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{upcomingEvents}</p>
          <Link to="/admin/events" className="text-sm text-[#5b9bd5] hover:underline mt-2 inline-block">
            View Schedule
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Events by Category</h2>
          
          <div className="space-y-4">
            {sortedCategories.map(([category, count]) => (
              <div key={category} className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div 
                    className="bg-[#5b9bd5] h-2.5 rounded-full"
                    style={{ width: `${(count / totalEvents) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between min-w-[130px]">
                  <span className="text-sm text-gray-600">{category}</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Users</h2>
          
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.slice(0, 5).map((user: any) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No users found</p>
          )}
          
          <div className="mt-4 text-right">
            <Link to="/admin/users" className="text-sm text-[#5b9bd5] hover:underline">
              View All Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;