import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';

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
  const { data, isLoading, error } = useQuery<Post[]>({
    queryKey: ['most-liked'],
    queryFn: async () => {
      const res = await api.get('/posts/most-liked?limit=10&page=1');
      console.log('API response:', res.data);
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className='space-y-4 p-4'>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className='h-24 w-full rounded-xl' />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className='p-4 text-red-500'>Gagal memuat postingan.</div>;
  }

  return (
    <div>
      <h2 className='md:text-display-xs custom-container mb-5 font-bold'>
        Most Liked
      </h2>
      <div className='flex-col space-y-4 md:w-full'>
        {Array.isArray(data)
          ? data.map((post) => (
              <Card
                key={post.id}
                className='flex flex-row border-b-2 py-2 last:border-b-0'
              >
                <div className='flex flex-1 flex-col md:block'>
                  <CardHeader className='flex flex-col items-start'>
                    <CardTitle className='text-md mb-1 flex flex-col font-bold md:text-xl'>
                      {post.title}
                    </CardTitle>
                    <CardDescription className='text-sm-regular mb-4 text-gray-500'>
                      {post.content.slice(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='mb-4 flex flex-1 flex-row items-center gap-4'></CardContent>
                  <CardFooter className='mb-4 flex-row items-center justify-start gap-4'>
                    <p className='text-xs-regular flex items-center gap-2 text-neutral-600 md:text-sm'>
                      <span role='img' aria-label='likes' className='mr-1'>
                        <img src='/icons/like.svg' />
                      </span>{' '}
                      {post.likes}
                    </p>
                    <p className='flex items-center gap-2 text-sm text-gray-500'>
                      <img src='/icons/comment.svg' />
                      {post.comments}
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
