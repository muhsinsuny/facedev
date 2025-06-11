import { useQuery } from '@tanstack/react-query';
import { getPost } from '../../lib/api/post';
import { useAuth } from '../../context/AuthContext';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { useNavigate } from 'react-router-dom';

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

export default function PostTabs() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: posts } = useQuery({
    queryKey: ['recommended-posts'],
    queryFn: () => getPost(20, 1),
  });

  const myPosts =
    posts?.filter((post: Post) => post.author?.id === user?.id) || [];

  return (
    <div>
      <h3 className='text-lg-bold mt-4 text-neutral-900'>
        {' '}
        {myPosts.length || 0} Post
      </h3>
      {user && myPosts.length > 0 ? (
        myPosts.map((post: Post) => (
          <Card
            key={post.id}
            className='flex w-full flex-row border-b-2 last:border-b-0'
          >
            <img
              src={post.imageUrl || '/images/image.png'}
              width={340}
              height={208}
              className='hidden rounded-sm md:block md:py-4'
              onError={(e) => {
                e.currentTarget.src = '/images/coffee.png';
              }}
            />
            <div className='flex flex-1 flex-col md:block'>
              <CardHeader className='flex flex-col items-start'>
                <CardTitle
                  className='text-md-bold text-md mb-3 flex cursor-pointer flex-col font-bold text-neutral-900 md:text-xl'
                  onClick={() => navigate(`/detail/${post.id}`)}
                >
                  {post.title}
                  <div className='text-xs-regular mt-3 flex h-full w-full flex-row gap-4 text-neutral-900'>
                    {post.tags?.slice(0, 4).map((tag, idx) => (
                      <div
                        key={idx}
                        className='text-xs-regular rounded-md border border-neutral-300 px-2 py-1'
                      >
                        {tag.trim()}
                      </div>
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardDescription className='text-xs-regular mb-4 text-gray-500 md:text-sm'>
                {post.content.slice(0, 100)}...
              </CardDescription>
              <CardFooter className='flex-start flex flex-col'>
                <div className='flex flex-row justify-between'>
                  <div>Created {post.createdAt} </div>
                  <div>|</div>
                  <div>Last updated {post.createdAt}</div>
                </div>
                <div className='flex flex-row justify-between gap-4'>
                  <div className='text-primary-300 text-sm-semibold hover:cursor-pointer hover:underline'>
                    Statistic
                  </div>
                  <div>|</div>
                  <div className='text-primary-300 text-sm-semibold hover:cursor-pointer hover:underline'>
                    Edit{' '}
                  </div>
                  <div>|</div>
                  <div className='text-sm-semibold text-red-500 hover:cursor-pointer hover:underline'>
                    Delete
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
