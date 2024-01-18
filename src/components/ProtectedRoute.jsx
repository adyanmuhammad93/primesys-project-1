import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  console.log(user);

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if the user's role is authorized or if the user is an administrator
  if (
    roles &&
    roles.length &&
    !roles.includes(user.user.role) &&
    user.user.role !== "administrator"
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If the user's role is authorized or the user is an administrator, render the children
  return children;
};

export default ProtectedRoute;
