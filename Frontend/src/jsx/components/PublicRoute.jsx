
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // Agar already logged in hai toh dashboard pe bhejo
  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;