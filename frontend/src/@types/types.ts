import React from "react";
import { RouteObject } from "react-router";

// type for Main Layout
export interface ComponentChildren {
  children?: React.ReactNode;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
}

export type Route = RouteObject;
// type for route
export type Routes = {
  path: string;
  element: React.ReactNode;
  exact?: boolean;
  children?: Route[] | null;
};


//Signup types
export type SignupForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};


export interface AuthenticationContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (refreshToken: string | null) => void;
}