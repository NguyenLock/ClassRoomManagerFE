import { auth } from '../utils/auth';
import { Navigate, Outlet } from 'react-router-dom';
import { showToast } from '../components/UI/modal/Toast';

interface PrivateRouteProps {
  userType: 'instructor' | 'student';
}

export const PrivateRoute = ({ userType }: PrivateRouteProps) => {
  const isAuthenticated = auth.isAuthenticated();
  const currentUserType = localStorage.getItem('userType');
  const token = auth.getToken();

  if (token) {
    try {
      const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expirationTime) {
        auth.removeToken();
        showToast.warning("Session expired. Please login again.");
        return <Navigate to="/login" />;
      }
    } catch (error) {
      auth.removeToken();
      return <Navigate to="/login" />;
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (currentUserType !== userType) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}; 