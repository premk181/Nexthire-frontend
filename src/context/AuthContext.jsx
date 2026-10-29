import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('nexthire_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('nexthire_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('nexthire_user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to fetch current user context', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const authData = res.data;
    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('nexthire_token', authData.token);
    localStorage.setItem('nexthire_user', JSON.stringify(authData));
    return authData;
  };

  const register = async (registerData) => {
    const res = await api.post('/auth/register', registerData);
    const authData = res.data;
    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('nexthire_token', authData.token);
    localStorage.setItem('nexthire_user', JSON.stringify(authData));
    return authData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nexthire_token');
    localStorage.removeItem('nexthire_user');
  };

  const value = {
    token,
    user,
    role: user?.role,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    refreshUser: fetchCurrentUser,
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
