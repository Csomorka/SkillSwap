import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;
