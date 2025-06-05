import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export interface User {
  name: string;
  avatarUrl: string;
  email: string;
  password?: string;
  token?: string;
  profile?: [
    {
      id: string;
      name: string;
      headline: string;
      avatarUrl: string;
    }
  ] ;
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

 