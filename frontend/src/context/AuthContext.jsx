import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { ownerApplicationApi } from '../api/ownerApplicationApi';

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
  const [ownerApplication, setOwnerApplication] = useState(() => {
    const savedApp = localStorage.getItem('parkease_owner_app');
    try {
      return savedApp ? JSON.parse(savedApp) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const saveAuth = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('parkease_token', authToken);
    localStorage.setItem('parkease_user', JSON.stringify(authUser));
    // Trigger application status check
    if (authUser?.role === 'USER') {
      fetchApplicationStatus(authToken);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setOwnerApplication(null);
    localStorage.removeItem('parkease_token');
    localStorage.removeItem('parkease_user');
    localStorage.removeItem('parkease_owner_app');
  };

  const fetchApplicationStatus = useCallback(async (activeToken) => {
    const t = activeToken || token;
    if (!t) {
      setOwnerApplication(null);
      localStorage.removeItem('parkease_owner_app');
      return null;
    }
    try {
      const res = await ownerApplicationApi.getMyApplication();
      if (res && res.data) {
        setOwnerApplication(res.data);
        localStorage.setItem('parkease_owner_app', JSON.stringify(res.data));
        return res.data;
      } else {
        setOwnerApplication(null);
        localStorage.removeItem('parkease_owner_app');
        return null;
      }
    } catch {
      // Quiet fail if not found or 204
      return null;
    }
  }, [token]);

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const response = await authApi.getProfile();
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      localStorage.setItem('parkease_user', JSON.stringify(updatedUser));
      if (updatedUser.role === 'USER') {
        await fetchApplicationStatus(token);
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const currentToken = localStorage.getItem('parkease_token');
      const currentUserStr = localStorage.getItem('parkease_user');
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

      setToken(currentToken);
      setUser(currentUser);

      if (currentToken && currentUser?.role === 'USER') {
        try {
          const res = await ownerApplicationApi.getMyApplication();
          if (res && res.data) {
            setOwnerApplication(res.data);
            localStorage.setItem('parkease_owner_app', JSON.stringify(res.data));
          }
        } catch {
          // ignore
        }
      }
      setLoading(false);
    };

    const handleAuthChange = () => {
      const currentToken = localStorage.getItem('parkease_token');
      const currentUser = localStorage.getItem('parkease_user');
      setToken(currentToken);
      setUser(currentUser ? JSON.parse(currentUser) : null);
    };

    window.addEventListener('auth_state_changed', handleAuthChange);
    initAuth();

    return () => {
      window.removeEventListener('auth_state_changed', handleAuthChange);
    };
  }, []);

  // Compute clean derived portalMode
  const portalMode = (() => {
    if (!token || !user) return 'PUBLIC';
    if (user.role === 'ADMIN') return 'ADMIN';
    if (user.role === 'OWNER') return 'OWNER';
    if (user.role === 'USER' && (ownerApplication?.status === 'PENDING' || ownerApplication?.status === 'UNDER_REVIEW')) {
      return 'PARTNER';
    }
    return 'USER';
  })();

  const value = {
    user,
    token,
    role: user?.role || null,
    ownerApplication,
    portalMode,
    isAuthenticated: !!token && !!user,
    saveAuth,
    logout,
    refreshProfile,
    fetchApplicationStatus,
    setOwnerApplication,
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

