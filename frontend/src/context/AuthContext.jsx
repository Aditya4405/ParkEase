import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('parkease_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('parkease_token') || null);
  const [loading, setLoading] = useState(true);

  const saveAuth = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('parkease_token', authToken);
    localStorage.setItem('parkease_user', JSON.stringify(authUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('parkease_token');
    localStorage.removeItem('parkease_user');
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const response = await authApi.getProfile();
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      localStorage.setItem('parkease_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  useEffect(() => {
    const handleAuthChange = () => {
      const currentToken = localStorage.getItem('parkease_token');
      const currentUser = localStorage.getItem('parkease_user');
      setToken(currentToken);
      setUser(currentUser ? JSON.parse(currentUser) : null);
    };

    window.addEventListener('auth_state_changed', handleAuthChange);
    setLoading(false);

    return () => {
      window.removeEventListener('auth_state_changed', handleAuthChange);
    };
  }, []);

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    saveAuth,
    logout,
    refreshProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
