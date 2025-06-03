// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { registerUser, loginUser, updateUserProfile } from '../lib/api/auth';
import { api } from '../lib/api';

export interface User {
  name: string;
  avatarUrl: string;
  email: string;
  password?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing user or token from localStorage:', error);
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    sessionStorage.setItem('token', data.token);
    setToken(data.token);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await registerUser(name, email, password);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setToken(data.token);
  };

  const handleUpdateUserProfile = async (
    name: string,
    email: string,
    avatarUrl: string
  ) => {
    if (!token) throw new Error('User not authenticated');
    const response = await updateUserProfile({ name, email });
    const updatedUser = { ...user, name, email, avatarUrl };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    if (!response || !response.user) {
      throw new Error('Failed to update profile');
    }
  };

  const fetchPosts = async (
    title: string,
    content: string,
    tags: string,
    image: string
  ) => {
    const res = await api.get(
      `/posts?title=${title}&content=${content}&tags=${tags}&image=${image}`
    );
    return res.data;
  };

  return {
    user,
    token,
    login,
    loading,
    register,
    fetchPosts,
    handleUpdateUserProfile,
    name: user?.name || '',
    avatarUrl: user?.avatarUrl || '',
  };
}
