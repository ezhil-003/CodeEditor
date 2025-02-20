import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { AuthenticationContextType } from '../@types/types';
import { decryptRefreshToken } from '../utils/encryption';
import { refreshAccessToken } from '../api/api';
import { useMutation } from '@tanstack/react-query';

export const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use raw mutation without context dependency
  const { mutateAsync: refreshTokenMutate } = useMutation({
    mutationFn: refreshAccessToken
  });
  const refreshAccessTokenHandler = async (currentRefreshToken: string) => {
    try {
      const newAccessToken = await refreshTokenMutate(currentRefreshToken);
      setToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      handleLogout();
      throw error;
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

  useEffect(() => {
    const initializeAuth = async () => {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (storedRefreshToken) {
        try {
          const decryptedToken = await decryptRefreshToken(storedRefreshToken);
          setRefreshToken(decryptedToken);
          await refreshAccessTokenHandler(decryptedToken);
        } catch (error) {
          console.error("Error decrypting refresh token:", error);
          handleLogout();
        }
      } else {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthenticationContext.Provider value={{ token, setToken, refreshToken, setRefreshToken, isLoading, handleLogout, isAuthenticated }}>
      {!isLoading && children}
    </AuthenticationContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthenticationContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};