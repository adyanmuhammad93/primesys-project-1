import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  console.log(user);

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if the user's role is authorized
  if (roles && roles.length && !roles.includes(user.user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If the user's role is authorized, render the children
  return children;
};

export default ProtectedRoute;
