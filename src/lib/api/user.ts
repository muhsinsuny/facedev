// src/lib/api/user.ts
import { api } from './index';

// ambil profile user
export const getProfile = async () => {
  const res = await api.get(`/users/profile`);

  return res.data;
};

// update profile user

export const updateUserProfile = async (
  data: Partial<{ name: string; headline: string; avatarUrl?: string }>
) => {
  const res = await api.patch('/users/profile', data);

  return res.data;
};

// update password user

export const updateUserPassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const res = await api.patch('/users/password', data);

  return res.data;
};

// delete user account
export const deleteUserAccount = async () => {
  const res = await api.delete('/users/delete');

  return res.data;
};
