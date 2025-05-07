import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, X } from 'lucide-react';

type AdminSidebarProps = {
  isOpen: boolean;
  closeSidebar: () => void;
};

const AdminSidebar = ({ isOpen, closeSidebar }: AdminSidebarProps) => {
  return (
    <div className={`fixed inset-0 z-50 md:relative ${isOpen ? 'block' : 'hidden md:block'}`}>
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 md:hidden" 
        onClick={closeSidebar}
      />
      
      <aside className={`w-64 h-full bg-white shadow-lg overflow-y-auto fixed md:sticky top-0 transition-all duration-300 ease-in-out z-10`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#5b9bd5]">Admin Panel</h2>
          <button 
            onClick={closeSidebar} 
            className="md:hidden p-1 rounded-full hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <NavLink 
                to="/admin" 
                end
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-md transition-colors ${
                    isActive ? 'bg-[#5b9bd5] text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                onClick={closeSidebar}
              >
                <LayoutDashboard className="h-5 w-5 mr-3" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                to="/admin/events" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-md transition-colors ${
                    isActive ? 'bg-[#5b9bd5] text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                onClick={closeSidebar}
              >
                <Calendar className="h-5 w-5 mr-3" />
                <span>Manage Events</span>
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                to="/admin/users" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-md transition-colors ${
                    isActive ? 'bg-[#5b9bd5] text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                onClick={closeSidebar}
              >
                <Users className="h-5 w-5 mr-3" />
                <span>Manage Users</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default AdminSidebar;