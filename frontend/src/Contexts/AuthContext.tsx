import React, { createContext, useLayoutEffect, use, useState } from 'react';
import { AuthenticationContextType } from '../@types/types';
import { decryptRefreshToken } from '../utils/encryption';
import { useRefreshTokenMutation } from '../api/query';
// import { useNavigate } from 'react-router';

export const AuthenticationContext = createContext<AuthenticationContextType | null>({
  token: null,
  setToken: () => { },
  refreshToken: null,
  setRefreshToken: () => { },
  isLoading: false,
  handleLogout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
 

  const { mutate: refreshTokenMutate } = useRefreshTokenMutation();
 
  const refreshAccessToken = async () => {
    if (!refreshToken) return;
    try {
      refreshTokenMutate(refreshToken);
    } catch (error) {
      console.error("Error refreshing access token:", error);
      handleLogout(); // Logout on refresh token failure
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  useLayoutEffect(() => {
    const initializeAuth = async () => {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (storedRefreshToken) {
        try {
          const decryptedToken = await decryptRefreshToken(storedRefreshToken); // Await the decryption
          setRefreshToken(decryptedToken); // Set the decrypted token
          await refreshAccessToken(); // Ensure the token refresh happens sequentially
        } catch (error) {
          console.error("Error decrypting refresh token:", error);
          handleLogout(); // Handle logout on decryption or refresh failure
        }
      } else {
        return 
      }
    };
  
    initializeAuth(); // Call the async function
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthenticationContext value={{ token, setToken, refreshToken, setRefreshToken, isLoading, handleLogout, isAuthenticated }}>
      {!isLoading && children}
    </AuthenticationContext>
  );
}

export const useAuth = () => {
  const context = use(AuthenticationContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};