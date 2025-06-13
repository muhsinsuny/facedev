import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import {
  fetchMostLikedPosts,
  fetchPostComments,
  fetchPostLikes,
} from '../lib/api/post';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  likes: number;
  comments?: number;
  className?: string;
  author?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

function MostLike() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery<Post[]>({
    queryKey: ['most-liked'],
    queryFn: async () => {
      const res = await fetchMostLikedPosts(1, 5);
      return res.data;
    },
  });

  useEffect(() => {
    fetchPostComments(1);
    fetchPostLikes(1);
  });

  if (isLoading) {
    return (
      <div className='p-4 space-y-4'>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className='w-full h-24 rounded-xl' />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className='p-4 text-red-500'>Gagal memuat postingan.</div>;
  }

  return (
    <div className='custom-container'>
      <h2 className='mb-5 font-bold md:text-display-xs'>Most Liked</h2>
      <div className='flex-col space-y-4 md:w-full'>
        {Array.isArray(data)
          ? data.map((post) => (
              <Card
                key={post.id}
                className='flex flex-row py-2 border-b-2 last:border-b-0'
              >
                <div className='flex flex-col flex-1 md:block'>
                  <CardHeader className='flex flex-col items-start'>
                    <CardTitle
                      className='flex flex-col mb-1 font-bold cursor-pointer text-md hover:text-primary-300 hover:underline md:text-xl'
                      onClick={() => {
                        if (user?.id !== post.author?.id) {
                          return navigate(`/detail/${post.id}`);
                        } else navigate(`/update-post/${post.id}`);
                      }}
                    >
                      {post.title}
                    </CardTitle>
                    <CardDescription className='mb-4 text-gray-500 text-sm-regular'>
                      {post.content.slice(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='flex flex-row items-center flex-1 gap-4 mb-4'></CardContent>
                  <CardFooter className='flex-row items-center justify-start gap-4 mb-4'>
                    <p className='flex items-center gap-2 text-xs-regular text-neutral-600 md:text-sm'>
                      <span role='img' aria-label='likes' className='mr-1'>
                        <img src='/icons/like.svg' />
                      </span>{' '}
                      {post.likes}
                    </p>
                    <p className='flex items-center gap-2 text-sm text-gray-500'>
                      <img src='/icons/comment.svg' />
                      {post?.comments}
                    </p>
                  </CardFooter>
                </div>
              </Card>
            ))
          : null}
      </div>
    </div>
  );
}

export default MostLike;
