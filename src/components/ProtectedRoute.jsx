import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // If there is no token, redirect to login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If the user's role does not match the allowed role, redirect to login
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // If authorized, render the wrapped component
  return children;
}

export default ProtectedRoute;
