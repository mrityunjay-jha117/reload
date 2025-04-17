// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("jwt");
//will add more implementation here later on will add fetching auth
  if (!token) {
    toast.error("Please login to access this page.");
    return <Navigate to="/" replace />;
  }

  return children;
}
