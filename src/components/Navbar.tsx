import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Menu, Bell, Calendar, LogOut, User, Home, X } from 'lucide-react';

type NavbarProps = {
  toggleSidebar: () => void;
};

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { currentUser, logout } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <nav className="bg-[#5b9bd5] text-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex items-center ml-2 md:ml-0">
              <span className="text-xl font-bold">Campus Connect</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="p-2 rounded-md hover:bg-[#4a8ac4] transition-colors flex items-center">
              <Home className="h-5 w-5 mr-1" />
              <span>Home</span>
            </Link>
            
            <Link to="/calendar" className="p-2 rounded-md hover:bg-[#4a8ac4] transition-colors flex items-center">
              <Calendar className="h-5 w-5 mr-1" />
              <span>Calendar</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentUser ? (
              <>
                <Link to="/notifications" className="p-2 rounded-md hover:bg-[#4a8ac4] transition-colors relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                
                <Link to="/profile" className="p-2 rounded-md hover:bg-[#4a8ac4] transition-colors">
                  <User className="h-5 w-5" />
                </Link>
                
                <button 
                  onClick={logout}
                  className="p-2 rounded-md hover:bg-[#4a8ac4] transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="py-2 px-4 bg-white text-[#5b9bd5] font-medium rounded-md hover:bg-opacity-90 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;