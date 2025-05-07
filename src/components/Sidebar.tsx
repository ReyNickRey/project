import { NavLink } from 'react-router-dom';
import { Home, Calendar, User, Bell, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

type SidebarProps = {
  isOpen: boolean;
  closeSidebar?: () => void;
};

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const { currentUser } = useAuth();
  const { unreadCount } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 md:static md:z-0 ${isOpen ? 'block' : 'hidden'} md:block`}>
      <div className="absolute inset-0 bg-black bg-opacity-50 md:hidden" onClick={closeSidebar} />
      
      <aside className="w-64 h-full bg-white shadow-lg overflow-y-auto fixed md:sticky top-0 left-0 transition-all duration-300 ease-in-out z-10 md:z-0">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#5b9bd5]">Navigation</h2>
          {closeSidebar && (
            <button onClick={closeSidebar} className="md:hidden p-1 rounded-full hover:bg-gray-200">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-md transition-colors ${
                    isActive ? 'bg-[#5b9bd5] text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                onClick={closeSidebar}
              >
                <Home className="h-5 w-5 mr-3" />
                <span>Home</span>
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                to="/calendar" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-md transition-colors ${
                    isActive ? 'bg-[#5b9bd5] text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                onClick={closeSidebar}
              >
                <Calendar className="h-5 w-5 mr-3" />
                <span>Calendar</span>
              </NavLink>
            </li>
            
            {currentUser && (
              <>
                <li>
                  <NavLink 
                    to="/profile" 
                    className={({ isActive }) => 
                      `flex items-center p-2 rounded-md transition-colors ${
                        isActive ? 'bg-[#5b9bd5] text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                    onClick={closeSidebar}
                  >
                    <User className="h-5 w-5 mr-3" />
                    <span>Profile</span>
                  </NavLink>
                </li>
                
                <li>
                  <NavLink 
                    to="/notifications" 
                    className={({ isActive }) => 
                      `flex items-center p-2 rounded-md transition-colors ${
                        isActive ? 'bg-[#5b9bd5] text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                    onClick={closeSidebar}
                  >
                    <Bell className="h-5 w-5 mr-3" />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;