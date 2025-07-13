import { auth } from '../utils/auth';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  userType: 'instructor' | 'student';
}

export const PrivateRoute = ({ userType }: PrivateRouteProps) => {
  const isAuthenticated = auth.isAuthenticated();
  const currentUserType = localStorage.getItem('userType');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (currentUserType !== userType) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}; 