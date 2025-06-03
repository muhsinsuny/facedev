// src/lib/api/auth.ts
import { api } from './index';

export const loginUser = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data; // asumsi: { user: {…}, token: "..." }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data; // asumsi: { user: {…}, token: "..." }
};
export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data; // asumsi: { user: {…} }
};
export const updateUserProfile = async (
  data: Partial<{ name: string; email: string; avatar?: string }>
) => {
  const res = await api.patch('/auth/profile', data);
  return res.data; // asumsi: { user: {…} }
};
export const updateUserPassword = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  const res = await api.patch('/auth/password', data);
  return res.data; // asumsi: { message: "Password updated successfully" }
};
export const deleteUserAccount = async () => {
  const res = await api.delete('/auth/delete');
  return res.data; // asumsi: { message: "Account deleted successfully" }
};

export const fetchPosts = async (
  title: string,
  content: string,
  tags: string,
  image: string
) => {
  const res = await api.get(`/posts`, {
    params: { title, content, tags, image },
  });
  return res.data;
};
