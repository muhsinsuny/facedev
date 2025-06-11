import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchPosts } from '../lib/api/post'; // ganti sesuai lokasi fungsi fetch
import { useAuth } from '../context/AuthContext';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  imageUrl?: string;
  tags: string[];
  content: string;
}
export default function PostTabs() {
  const { user } = useAuth();
  console.log('user', user);
  // const [activeTab, setActiveTab] = useState<'posts' | 'password'>('posts');
  // const [data, setData] = useState<Post[]>([]);
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['user-posts', user?.id],
    queryFn: () => fetchPosts(Number(user?.id)),
    enabled: !!user?.id,
  });

  useEffect(() => {
    console.log('fetched posts', posts);
    if (posts) {
      setUserPosts(posts);
    }
  }, [posts]);

  if (isError) {
    return <div>Error fetching posts: {(error as Error).message}</div>;
  }

  // Update userPosts when posts changes

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        {/* Tabs */}
        {userPosts && userPosts.length > 0 ? (
          userPosts.map((post: Post) => (
            <Card
              key={post.id}
              className='flex flex-row w-full border-b-2 last:border-b-0'
            >
              <img
                src={post.imageUrl || '/images/image.png'}
                width={340}
                height={208}
                className='hidden rounded-sm md:block md:py-4'
              />
              <div className='flex flex-col flex-1 md:block'>
                <CardHeader className='flex flex-col items-start'>
                  <CardTitle
                    className='flex flex-col mb-3 font-bold cursor-pointer text-md-bold text-md text-neutral-900 md:text-xl'
                    onClick={() => navigate(`/detail/${post.id}`)}
                  >
                    {post.title}
                    <div className='flex flex-row w-full h-full gap-4 mt-3 text-xs-regular text-neutral-900'>
                      {post.tags
                        ?.slice(0, 4)
                        .map((tag: string, idx: number) => (
                          <div
                            key={idx}
                            className={`text-xs-regular rounded-md border px-2 py-1 ${
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
                </CardHeader>
                <CardDescription className='mb-4 text-gray-500 text-xs-regular md:text-sm'>
                  {post.content.slice(0, 100)}...
                </CardDescription>
              </div>
            </Card>
          ))
        ) : (
          <p>List of your posts will appear here.</p>
        )}
      </div>
    </>
  );
}
