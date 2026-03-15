import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/demo/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={`/demo/${user.role}`} replace />;
  }

  return children;
}
