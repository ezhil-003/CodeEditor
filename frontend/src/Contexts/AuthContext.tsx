import React, { createContext, useEffect, use, useState } from 'react';
import { AuthenticationContextType } from '../@types/types';

import { Navigate } from 'react-router';
import { decryptRefreshToken } from '../utils/encryption';

export const AuthenticationContext = createContext<AuthenticationContextType | null>({
  token: null,
  setToken: () => { },
  refreshToken: null,
  setRefreshToken: () => { }
});



export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); 
 

  useEffect(() => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedRefreshToken) {
      try {
        const decryptedRefreshToken = decryptRefreshToken(storedRefreshToken);
        setRefreshToken(decryptedRefreshToken);
        // Attempt to fetch the access token using the refreshed token
        refreshAccessToken();
      } catch (error) {
        console.error('Error decrypting refresh token:', error);
        // Handle decryption error 
      }
    }
  }, []);

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        // Handle error (e.g., invalid refresh token, server error)
        handleTokenRefreshError();
        return;
      }

      const data = await response.json();
      const newAccessToken = data.accessToken; 

      setToken(newAccessToken);
      localStorage.setItem('accessToken', newAccessToken); 
      setIsLoading(false); 

    } catch (error) {
      handleTokenRefreshError(); 
    }
  };

  const handleTokenRefreshError = () => {
    // Handle token refresh error (e.g., logout)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setRefreshToken(null);
    setIsLoading(false); 
    // router.push('/login'); 
  };

  return (
    <AuthenticationContext value={{ token, setToken, refreshToken, setRefreshToken }}>
      {children}
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