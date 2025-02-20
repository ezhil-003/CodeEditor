import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../Contexts/AuthContext";

export const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth(); // Get the full auth object
  const location = useLocation();

  if (!auth) {
    return <div>Loading...</div>; // 🚀 Prevents "useAuth must be used within an AuthProvider"
  }

  const { isLoading, isAuthenticated } = auth;

  if (isLoading) {
    return <div>Loading...</div>; // ✅ Show a loader while checking auth state
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};