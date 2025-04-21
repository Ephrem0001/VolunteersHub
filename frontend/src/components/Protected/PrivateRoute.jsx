import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Fetch user from storage
  return user && user.role === role ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
