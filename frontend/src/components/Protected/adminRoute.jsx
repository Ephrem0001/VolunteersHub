import { Navigate } from "react-router-dom";

const AdminRoute = ({ children, role }) => {
  const storedRole = localStorage.getItem("role");
console.log(storedRole)
  // Log the stored role for debugging
  console.log("Stored Role:", storedRole);
  console.log("Expected Role:", role);

  // If the stored role doesn't match the required role, redirect to login
  if (storedRole !== role) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminRoute;
