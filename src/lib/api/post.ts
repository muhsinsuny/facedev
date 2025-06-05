// src/lib/api/post.ts
import { api } from './index';

// ✅ Ambil post list berdasarkan ID
export const fetchPosts = async (
  id: number,
) => {
  const res = await api.get(`/posts/${id}`, {
    params: { id },
  });
  return res.data;
};

// ✅ Ambil post recommended
export const fetchRecommendedPosts = async (
  limit: number,
  page: number,
) => {
  if (page < 1) page=1;
  const res = await api.get(`/posts/recommended?${limit}&${page}`, {
    params: { limit, page  },
  });
  console.log('Recommended posts:', res.data);
  return res.data.data;
};

// ✅ Ambil post most liked
export const fetchMostLikedPosts = async (
  page: number,
  limit: number,
) => {
  const res = await api.get('/posts/most-liked', {
    params: { page, limit },
  });
  console.log('Most liked posts:', res.data);
  return res.data;
};

// ✅ Ambil post detail
export const fetchPostDetail = async (id: string) => {
  const res = await api.get(`/posts/${id}`);
  return res.data;
};

// ✅ Buat post baru
export const createPost = async (
  title: string,
  content: string,
  tags: string[],
  image?: string
) => {
  const res = await api.post('/posts', {
    title,
    content,
    tags,
    image,
  });
  return res.data;
};

// ✅ Update post
export const updatePost = async (
  id: number,
  title: string,
  content: string,
  tags: string[],
  image?: string
) => {
  const res = await api.put(`/posts/${id}`, {
    title,
    content,
    tags,
    image,
  });
  return res.data;
};

// ✅ Hapus post
export const deletePost = async (id: number) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
}

// ✅ Like post
export const likePost = async (id: number) => {
  const res = await api.post(`/posts/${id}/like`);
  return res.data;
};

// comment on post
export const commentOnPost = async (
  postId: number,
  content: string
) => {
  const res = await api.post(`/comments/${postId}`, { content });
  return res.data;
};

// delete comment on post
export const deleteCommentOnPost = async (
  postId: number,
) => {
  const res = await api.delete(`/comments/${postId}`);
  return res.data;
};


