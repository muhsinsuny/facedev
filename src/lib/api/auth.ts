// src/lib/api/auth.ts
import { api } from './index';

// login

interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
    avatarUrl: string;
  };
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  }
   catch (error) {
    if (error instanceof Error) {
    console.error('Login failed:', error);
    throw error;
  } else {
    console.log('Login successful:', error);
    throw new Error('An unexpected error occurred during login.');
  };
}}

// logout

export const logoutUser = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// register

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await api.post('/auth/register', { name, email, password });

  return res.data; 
};

// get current user profile
export const getUserByEmail = async (email: string) => {
  const token = localStorage.getItem('token');
  const res = await api.get(`/users/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data; 
};

// update user profile
export const updateUserProfile = async (
  data: Partial<{ name: string; email: string; avatar?: string }>
) => {
  const res = await api.patch('/users/profile', data);
  return res.data; 
};

// update user password
export const updateUserPassword = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  const res = await api.patch('/users/password', data);
  return res.data; 
};

// delete user account
export const deleteUserAccount = async () => {
  const res = await api.delete('/users/delete');
  return res.data; 
};


