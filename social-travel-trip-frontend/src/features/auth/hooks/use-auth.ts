'use client';

import { useEffect, useState } from 'react';
import { getAccessToken, getUserInfo, isLoggedIn } from '../auth.service';

/**
 * Custom hook for authentication
 * Provides authentication state and user information
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = isLoggedIn();
    setIsAuthenticated(loggedIn);

    // Get token if logged in
    if (loggedIn) {
      const authToken = getAccessToken();
      setToken(authToken);

      // Get user information
      const userInfo = getUserInfo();
      setUser(userInfo);
    }

    setLoading(false);
  }, []);

  return {
    isAuthenticated,
    token,
    user,
    loading,
  };
};
