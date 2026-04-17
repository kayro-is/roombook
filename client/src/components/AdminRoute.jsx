import { Navigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";

function AdminRoute({ children }) {
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;