
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {

  const { token, role } = useAuth();

  // Check whether user is logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check whether user has permission
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Allow access
  return children;
}

export default ProtectedRoute;
