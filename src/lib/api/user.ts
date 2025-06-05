// src/lib/api/user.ts
import { api } from './index';


// ambil profile user
export const getProfile = async () => {
  const res = await api.get(`/users/profile`);

  return res.data;
};

// update profile user

export const updateUserProfile = async (
  data: Partial<{ name: string; email: string; avatar?: string }>
) => {
  const res = await api.patch('/users/profile', data);

  return res.data;
};

// update password user

export const updateUserPassword = async (
  data: { oldPassword: string; newPassword: string }
) => {
  const res = await api.patch('/users/password', data);

  return res.data;
};

// delete user account
export const deleteUserAccount = async () => {
  const res = await api.delete('/users/delete');

  return res.data;
};

