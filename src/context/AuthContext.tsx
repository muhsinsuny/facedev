// src/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  headline?: string;
};
export type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: { user: User; token: string }) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Cek token di localStorage saat pertama render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        setIsAuthenticated(true); // ✅ langsung set true di sini
      } catch (error) {
        console.error('Error parsing user or token from localStorage:', error);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      // try {
      //   setUser(JSON.parse(storedUser));
      //   setToken(storedToken);
      //   setIsAuthenticated(true);
      // } catch (error) {
      //   console.error('Error parsing user or token from localStorage:', error);
      //   setUser(null);
      //   setToken(null);
      //   localStorage.removeItem('token');
      //   localStorage.removeItem('user');
      // }
    }
    setTimeout(() => setLoading(false), 1000);
  }, [isAuthenticated]);

  const login = async (data: { user: User; token: string }) => {
    setUser(user);
    setToken(token);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', data.token);
  };

  const logoutHandler = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('token after logout', token);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout: logoutHandler, loading }}
    >
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
