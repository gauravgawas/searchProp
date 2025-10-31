import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useSelector((state: any) => state.auth.token);
  return token ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;
