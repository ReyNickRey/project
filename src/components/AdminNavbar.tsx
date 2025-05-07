import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, LogOut, User } from 'lucide-react';

type AdminNavbarProps = {
  toggleSidebar: () => void;
};

const AdminNavbar = ({ toggleSidebar }: AdminNavbarProps) => {
  const { logout } = useAuth();

  return (
    <nav className="bg-[#5b9bd5] text-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <Link to="/admin" className="flex items-center ml-2">
              <span className="text-xl font-bold">Admin Dashboard</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link to="/admin" className="p-2 rounded-md hover:bg-[#4a8ac4] transition-colors">
              <User className="h-5 w-5" />
            </Link>
            
            <button 
              onClick={logout}
              className="p-2 rounded-md hover:bg-[#4a8ac4] transition-colors"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;