import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { type User } from '../../context/AuthContext';
// import { useParams } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

interface PostStatisticProps {
  postId: number;
  trigger: React.ReactNode;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author?: {
    id: number;
    name: string;
    headline: string;
    avatarUrl: string;
  };
}

export default function PostStatistic({ postId, trigger }: PostStatisticProps) {
  const [open, setOpen] = useState(false);
  // const { user } = useAuth();
  // const { id } = useParams<{ id: string }>();

  const { data: likes, isLoading: loadingLikes } = useQuery({
    queryKey: ['postLikes', postId],
    queryFn: async () => {
      const res = await api.get(`/posts/${postId}/likes`);
      return res.data;
    },
    enabled: open && typeof postId === 'number' && postId > 0,
  });
  console.log('likes', likes);
  console.log('postId in dialog:', postId);

  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ['postComments', postId],
    queryFn: async () => {
      const res = await api.get(`/posts/${postId}/comments`);
      return res.data;
    },
    enabled: open && typeof postId === 'number' && postId > 0,
  });
  console.log('comments', comments);

  return (
    <div className='relative w-full md:w-full'>
      <div className=''>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
          <DialogContent className='sm:max-w-2xl'>
            <DialogHeader>
              <DialogTitle className='mt-0 text-left text-md-bold text-neutral-950'>
                Statistic
              </DialogTitle>
              <DialogDescription className='hidden'>
                See the statistic of this post
              </DialogDescription>
            </DialogHeader>

            <Tabs
              defaultValue='like'
              className='w-full mt-0 border-none shadow-none'
            >
              <TabsList className='grid w-full grid-cols-2 border-none'>
                <TabsTrigger
                  value='like'
                  className='border-none cursor-pointer'
                >
                  👍 Like
                </TabsTrigger>
                <TabsTrigger
                  value='comment'
                  className='border-none cursor-pointer border-l-1 border-neutral-300'
                >
                  💬 Comment
                </TabsTrigger>
              </TabsList>

              {/* LIKE TAB */}
              <TabsContent value='like'>
                <h4 className='mb-2 text-sm font-semibold'>
                  Like ({likes?.length})
                </h4>
                {loadingLikes ? (
                  <div className='flex justify-center py-6'>
                    <Loader2 className='w-5 h-5 text-muted-foreground animate-spin' />
                  </div>
                ) : (
                  <ul className='space-y-3'>
                    {likes?.map((user: User) => (
                      <li key={user.id} className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage
                            src={user?.avatarUrl || '/images/avatar.png'}
                            alt={user.name}
                            onError={(e) => {
                              e.currentTarget.src = '/images/avatar.png';
                            }}
                          />
                          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium'>{user.name}</p>
                          <p className='text-sm text-muted-foreground'>
                            {user?.headline ?? 'Frontend Developer'}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>

              {/* COMMENT TAB */}
              <TabsContent value='comment'>
                <h4 className='mb-2 text-sm font-semibold'>
                  Comment ({comments?.length})
                </h4>
                {loadingComments ? (
                  <div className='flex justify-center py-6'>
                    <Loader2 className='w-5 h-5 text-muted-foreground animate-spin' />
                  </div>
                ) : (
                  <ul className='space-y-4'>
                    {comments?.map((comment: Comment) => (
                      <li
                        key={comment.id + comment?.id}
                        className='flex items-start gap-3'
                      >
                        <Avatar>
                          <AvatarImage
                            src={
                              comment.author?.avatarUrl || '/images/avatar.png'
                            }
                            onError={(e) => {
                              e.currentTarget.src = '/images/avatar.png';
                            }}
                          />
                          <AvatarFallback>
                            {comment.author?.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium'>{comment.author?.name}</p>
                          <p className='text-sm text-muted-foreground'>
                            {comment.content}
                          </p>
                          <p className='mt-1 text-xs text-muted-foreground'>
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
