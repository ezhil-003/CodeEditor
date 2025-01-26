import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../Contexts/AuthContext";

export const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Add a loading spinner or skeleton UI
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin"  replace />;
  }

  return children;
};