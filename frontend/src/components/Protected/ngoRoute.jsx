import { Navigate } from "react-router-dom";

const NgoRoute = ({ children, role }) => {
  const storedRole = localStorage.getItem("role");
  return storedRole === role ? children : <Navigate to="/login-ngo" />;
};

export default NgoRoute;
