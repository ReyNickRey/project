import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = () => {
  const { currentUser } = useAuth();

  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;