import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from './Navbar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { api } from '../lib/api';
import { SearchBox } from './SearchBox';

interface Post {
  id: string;
  title: string;
  tags: string[];
  content: string;
  likes: number;
  comments: number;
  author: {
    name: string;
  };
  createdAt: string;
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const res = await api.get(`/posts/search?query=${query}&limit=10&page=1`);
      return res.data.data;
    },
    enabled: !!query,
  });

  return (
    <>
      <Navbar />
      <div className='custom-container'>
        <div className='max-w-4xl py-6 mx-auto'>
          <h1 className='hidden mb-6 text-2xl font-bold md:display-xl-bold md:block'>
            Search results for:{' '}
            <span className='text-blue-600'>{`"${query}"`}</span>
          </h1>

          {isLoading && <p>Loading...</p>}
          {isError && <p className='text-red-500'>Failed to load results.</p>}

          {data?.length === 0 && <p>No posts found.</p>}

          <div className='flex items-center justify-center w-full custom-container md:hidden'>
            <SearchBox className='w-full' />
          </div>

          <ul className='space-y-4'>
            {Array.isArray(data) && data.length > 0
              ? data?.map((post: Post) => (
                  <Card
                    key={post.id}
                    className='flex flex-row w-full py-2 border-b-2 last:border-b-0'
                  >
                    <img
                      src='/images/image.png'
                      width={340}
                      height={208}
                      className='hidden rounded-sm md:block md:py-4'
                    />
                    <div className='flex flex-col flex-1 md:block'>
                      <CardHeader className='flex flex-col items-start'>
                        <CardTitle className='flex flex-col mb-3 font-bold text-md md:text-xl'>
                          {post.title}
                          <div className='flex flex-row w-full h-full gap-4 mt-3 text-xs-regular text-neutral-900'>
                            {post.tags
                              ?.slice(0, 4)
                              .map((tag: string, idx: number) => (
                                <div
                                  key={idx}
                                  className={`rounded-md border px-2 py-1 text-xs ${
                                    idx === 0
                                      ? 'border-neutral-300 text-neutral-900'
                                      : ''
                                  }`}
                                >
                                  {tag.trim()}
                                </div>
                              ))}
                          </div>
                        </CardTitle>
                        <CardDescription className='mb-4 text-sm text-gray-500'>
                          {post.content.slice(0, 100)}...
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='flex flex-row items-center flex-1 gap-4 mb-4'>
                        <img
                          src='/images/avatar.png'
                          width={40}
                          height={40}
                          className='hidden md:block'
                        />
                        {/* {post.author?.avatarUrl}{' '} */}
                        <p className='md:text-sm-medium text-xs-text-xs-regular text-neutral-900'>
                          {post.author?.name}{' '}
                        </p>
                        <div className='w-2 h-2 border rounded-full bg-neutral-400' />
                        <p className='text-xs-regular text-neutral-600 md:text-sm'>
                          {new Date(post.createdAt || '').toLocaleDateString()}
                        </p>
                      </CardContent>
                      <CardFooter className='flex-row items-center justify-start gap-4 mb-4'>
                        <p className='flex items-center gap-2 text-xs-regular text-neutral-600 md:text-sm'>
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
          </ul>
        </div>
      </div>
    </>
  );
}
