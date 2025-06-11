// src/lib/api/post.ts
import type { QueryFunctionContext } from '@tanstack/react-query';
import { api } from './index';

// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   likes: number;
//   tags: string[];
//   className?: string;
//   comments?: number;
//   imageUrl?: string;
//   author?: {
//     id: string;
//     name: string;
//     avatarUrl?: string;
//   };
//   createdAt?: string;
// }

// ✅ Ambil post list berdasarkan ID
// export const fetchPosts = async (id: number) => {
//   const res = await api.get(`/posts/${id}`, {
//     params: { id },
//   });
//   return res.data;
// };

export const fetchPosts = async ({ queryKey }: QueryFunctionContext) => {
  const userId = queryKey[1] as number;

  // return await {
  //   queryKey: ['posts', userId],
  //   queryFn: async () => {
  if (userId) {
    try {
      const res = await api.get(`/posts/${userId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  } else {
    return [];
  }
};
export const getPost = async (limit: number = 5, page: number) => {
  const res = await api.get(`/posts/recommended`, {
    params: { limit, page },
  });
  console.log('Recommended posts:', res.data);
  return res.data.data;
};

// ✅ Ambil post recommended
export const fetchRecommendedPosts = async (
  limit: number = 5,
  page: number
) => {
  if (page < 1) page = 1;
  const res = await api.get(`/posts/recommended?${limit}&${page}`, {
    params: { limit, page },
  });
  console.log('Recommended posts:', res.data);
  return res.data;
};

// ✅ Ambil post most liked
export const fetchMostLikedPosts = async (page: number, limit: number) => {
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
  image: File // harus berupa File, bukan URL string
) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  tags.forEach((tag) => formData.append('tags', tag)); // tergantung backend, bisa juga join jadi 1 string
  formData.append('image', image); // harus File, bukan string

  const res = await api.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

// get user post
export const getUserPosts = async (id: number) => {
  const res = await api.get(`/posts/${id}`);
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
  const res = await api.patch(`/posts/${id}`, {
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
};

// ✅ Like post
export const likePost = async (id: number) => {
  const res = await api.post(`/posts/${id}/like`);
  return res.data;
};

// comment on post
export const commentOnPost = async (postId: number, content: string) => {
  const res = await api.post(`/comments/${postId}`, { content });
  return res.data;
};

// delete comment on post
export const deleteCommentOnPost = async (postId: number) => {
  const res = await api.delete(`/comments/${postId}`);
  return res.data;
};
