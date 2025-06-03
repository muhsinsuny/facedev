// src/lib/api/user.ts
import { api } from './index';

// pakai fetch (seperti sebelumnya)
export const getProfile = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${api.defaults.baseURL}api/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
};

// pakai axios (opsional jika mau seragam pakai axios)
export const updateUserProfile = async (
  token: string,
  data: Partial<{ name: string; email: string; avatar?: string }>
) => {
  const res = await api.patch('/api/users/profile', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateUserPassword = async (
  token: string,
  data: { oldPassword: string; newPassword: string }
) => {
  const res = await api.patch('/api/users/password', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
