import { useQuery } from '@tanstack/react-query';
import { deletePost, getMyPosts } from '../lib/api/post';
import { useAuth } from '../context/AuthContext';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from './partials/DeleteDialog';
import { toast } from 'sonner';
import { useState } from 'react';
import PostStatistic from './partials/PostStatistic';
import moment from 'moment';

interface Post {
  id: number;
  title: string;
  imageUrl?: string;
  tags: string[];
  content: string;
  createdAt?: string;
  author?: {
    id: number;
    name: string;
    avatarUrl: string;
  };
  likes: number;
}

export default function YourPosts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [postIdToDelete, setPostIdToDelete] = useState<number | null>(null);

  const {
    data: myPosts = [],
    isError,
    error,
  } = useQuery<Post[]>({
    queryKey: ['my-posts'],
    queryFn: () => getMyPosts(1, 10), // Sudah mengembalikan array
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className='max-w-3xl'>
      <div className='md:flex md:items-center md:justify-between'>
        <h3 className='mt-4 text-lg-bold text-neutral-900'>
          {myPosts.length} Post{myPosts.length !== 1 && 's'}
        </h3>
        <div className='relative hidden md:block'>
          <img
            className='absolute w-5 h-5 top-1/2 left-1/2 -translate-x-15'
            src='/icons/pencil-white.png'
            alt='Write Icon'
          />
          <button
            className='bg-primary-300 hover:bg-primary-200 text-sm-semibold right-0 mt-4 h-[44px] w-full cursor-pointer rounded-full text-white hover:text-black md:w-[182px]'
            onClick={() => navigate('/write')}
          >
            Write Post
          </button>
        </div>
      </div>

      {myPosts.length > 0 ? (
        myPosts.map((post) => (
          <Card
            key={post.id}
            className='flex flex-row w-full border-b-2 last:border-b-0 md:mt-10'
          >
            <img
              src={post.imageUrl || '/images/image.png'}
              width={340}
              height={208}
              className='hidden rounded-sm md:block md:py-4'
              onError={(e) => {
                e.currentTarget.src = '/images/coffee.png';
              }}
              alt={post.title}
            />
            <div className='flex flex-col flex-1 md:block'>
              <CardHeader className='flex flex-col items-start'>
                <CardTitle
                  onClick={() => navigate(`/detail/${post.id}`)}
                  className='mb-3 font-bold cursor-pointer text-md-bold hover:text-primary-300 text-neutral-900 hover:cursor-pointer hover:text-xl hover:underline'
                >
                  {post.title}
                </CardTitle>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {post.tags?.slice(0, 4).map((tag, idx) => (
                    <div
                      key={idx}
                      className='px-2 py-1 border rounded-md text-xs-regular border-neutral-300'
                    >
                      {tag.trim()}
                    </div>
                  ))}
                </div>
              </CardHeader>

              <CardDescription className='mb-4 text-gray-500 text-xs-regular md:text-sm'>
                {post.content?.slice(0, 100) || 'No content available...'}...
              </CardDescription>

              <CardFooter className='flex flex-col gap-2 text-xs flex-start text-neutral-700'>
                <div className='flex flex-row justify-between gap-2 text-xs'>
                  <span>
                    Created{' '}
                    {moment(post.createdAt).format('DD MMMM YYYY, HH:mm')}
                  </span>
                  <span>|</span>
                  <span>
                    Last updated:{' '}
                    {moment(post.createdAt).format('DD MMMM YYYY, HH:mm')}
                  </span>
                </div>
                <div className='flex flex-row justify-start'>
                  <div className='flex flex-row items-center justify-start gap-3'>
                    <div className='flex'>
                      <PostStatistic
                        trigger={
                          <button className='text-primary-300 hover:cursor-pointer hover:underline'>
                            Statistic
                          </button>
                        }
                        postId={post.id}
                      />
                    </div>
                    <div className='flex'>
                      <button
                        className='text-primary-300 hover:cursor-pointer hover:underline'
                        onClick={() => navigate(`/update-post/${post.id}`)}
                      >
                        Edit
                      </button>
                    </div>
                    <div className='flex'>
                      <DeleteDialog
                        trigger={
                          <button
                            className='text-red-500 hover:cursor-pointer hover:underline'
                            onClick={() => setPostIdToDelete(post.id)}
                          >
                            Delete
                          </button>
                        }
                        onConfirm={async () => {
                          if (postIdToDelete !== null) {
                            try {
                              await deletePost(postIdToDelete);
                              toast.success('Post deleted');
                              setPostIdToDelete(null);
                              setTimeout(() => {
                                window.location.reload();
                              }, 100);
                            } catch (error) {
                              console.error('Error deleting post:', error);
                              toast.error('Failed to delete post');
                            }
                          }
                        }}
                        onClose={() => setPostIdToDelete(null)}
                      />
                    </div>
                  </div>
                </div>
              </CardFooter>
            </div>
          </Card>
        ))
      ) : (
        <p>You haven't written any posts yet.</p>
      )}
    </div>
  );
}
