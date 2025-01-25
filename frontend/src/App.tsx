import { Suspense, useEffect } from "react";
import { createBrowserRouter, Navigate, RouterProvider, useLocation } from "react-router";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import "./App.css";
import MainLayout from "./Layouts/MainLayout";
import Notfound from "./Pages/Notfound";
import Loading from "./Components/utils/Loading";
import { publicRoutes, UserRoutes, ProtectedRoutes } from "./Routes/appRoutes";
import { ThemeProvider } from './Contexts/ThemeContext.tsx';
import { AuthProvider, useAuth } from "./Contexts/AuthContext.tsx";
import UserLayout from "./Layouts/UserLayout.tsx";
import { decryptRefreshToken } from './utils/encryption.ts';

function App() {
  const queryClient = new QueryClient();
  const {token, refreshToken } = useAuth();
  const location = useLocation();

 
  useEffect(() => {
    const recoverToken = async () => {
      if (!token) { 
        try {
          // 1. Retrieve and decrypt the refresh token
          const encryptedRefreshToken = localStorage.getItem('refreshToken');
          if (encryptedRefreshToken) { 
            const decryptedRefreshToken = await decryptRefreshToken(encryptedRefreshToken); 

            // 2. Make a request to the backend for a new access token
          } else {
            // Redirect to the login page with the current location as the 'from' parameter
            return <Navigate to="/signin" state={{ from: location }} replace />;
          }  
        } catch (error) {
          // Handle decryption or network error 
          console.error('Token recovery error:', error); 
        }
      }
      recoverToken();
      
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<Loading />}>
          <MainLayout />
        </Suspense>
      ),  // Use MainLayout directly here
      children: publicRoutes,
    },
    {
      path: "/user",
      element: (
        <Suspense fallback={<Loading />}>
          <ProtectedRoutes>
            <UserLayout />
          </ProtectedRoutes>
        </Suspense>
      ),
      children: UserRoutes,
    },
    {
      path: "*",
      element: (
        <>
          <Notfound />
        </>
      ),
    },
  ]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
