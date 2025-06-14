import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from '../hooks/useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (data: { user: User; token: string }) => {
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('accessToken', data.token);
    setUser(data.user);
    setToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, setUser, logout, login, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
