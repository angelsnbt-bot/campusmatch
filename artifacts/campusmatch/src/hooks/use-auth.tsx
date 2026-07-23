import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGetMe, logout, setAuthTokenGetter } from '@workspace/api-client-react';
import { User } from '@workspace/api-client-react';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  token: string | null;
  setToken: (token: string | null) => void;
  logoutUser: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('cm_token'));

  // Register the token getter once — keeps all generated API hooks authenticated
  useEffect(() => {
    setAuthTokenGetter(() => localStorage.getItem('cm_token'));
    return () => setAuthTokenGetter(null);
  }, []);
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useGetMe({
    query: {
      enabled: !!token,
      retry: false,
      queryKey: ['auth/me', token],
    }
  });

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('cm_token', newToken);
    } else {
      localStorage.removeItem('cm_token');
    }
    setTokenState(newToken);
  };

  const logoutUser = async () => {
    try {
      await logout({ headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Logout failed on server', error);
    } finally {
      setToken(null);
      queryClient.clear();
      setLocation('/login');
    }
  };

  useEffect(() => {
    if (isError) {
      setToken(null);
    }
  }, [isError]);

  return (
    <AuthContext.Provider value={{ user: user || null, token, setToken, logoutUser, isLoading: isLoading && !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
