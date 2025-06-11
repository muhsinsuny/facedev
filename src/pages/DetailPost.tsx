import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Textarea } from '../components/ui/textarea';
import { api } from '../lib/api';
import { usePostDetail } from '../hooks/usePostDetail';
import Navbar from './/partials/Navbar';
import Footer from './partials/Footer';
import CommentModal from './partials/CommentModal';
import LikeButton from '../pages/partials/LikeButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { useAuth } from '../context/AuthContext';

interface Comment {
  id: string;
  author?: {
    name: string;
  };
  createdAt: Date;
  content: string;
}

interface Post {
  id: string;
  likedByCurrentUser: boolean;
  likes: number;
  // other properties...
}

const DetailPost = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [comment, setComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  // const [currentPost, setCurrentPost] = useState<Post | null>(null);

  const { data: post, isLoading, error, refetch } = usePostDetail(id!);

  const { data: comments } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => (await api.get(`/posts/${id}/comments`)).data,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const commentMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      await api.post(`/comments/${id}`, { content });
    },
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    },
  });

  const { data: allPosts } = useQuery({
    queryKey: ['posts'],
    queryFn: async () =>
      (await api.get('/posts/search?query=coding&limit=5&page=1')).data.data ||
      [],
  });

  // useEffect(() => {
  //   const fetchPost = async () => {
  //     const res = await api.get(`/posts/${id}/likes`);
  //     setCurrentPost(res.data);
  //   };
  //   fetchPost();
  // }, [id]);

  const anotherPost = allPosts?.filter((p: Post) => p.id !== id)[0];
  const visibleComments =
    comments?.slice(0, showAllComments ? comments.length : 3) || [];

  if (isLoading) return <p className='mt-10 text-center'>Loading...</p>;
  if (error) return <p className='mt-10 text-center'>Error loading post</p>;

  return (
    <>
      {user && <Navbar />}
      <div className='custom-container'>
        <div className='max-w-3xl px-4 py-10 mx-auto'>
          <h1 className='mb-4 text-3xl font-bold'>{post.title}</h1>
          <div className='flex gap-4 mb-3'>
            {post.tags?.slice(0, 4).map((tag: string, idx: number) => (
              <span key={idx} className='px-2 py-1 text-xs border rounded'>
                {tag.trim()}
              </span>
            ))}
          </div>

          <div className='flex items-center gap-3 py-2 mb-4 border-b'>
            <img
              src={post.author?.avatarUrl || '/images/avatar.png'}
              alt='avatar'
              className='w-10 h-10 rounded-full'
            />
            <span>{post.author?.name}</span>
            <div className='w-2 h-2 bg-gray-400 rounded-full' />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          <div className='flex items-center gap-3 py-2 mb-4 border-b'>
            <LikeButton
              postId={id!}
              initialLiked={post.likedByCurrentUser}
              initialCount={post.likes}
              onLikeChange={() => refetch()}
            />
            <span className='flex items-center gap-1 text-sm text-gray-500'>
              <img src='/icons/comment.svg' alt='comment icon' />
              {comments?.length || 0}
            </span>
          </div>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className='w-full mb-6 rounded-lg'
              onError={(e) => {
                e.currentTarget.src = '/images/coffee.png';
              }}
            />
          )}

          <div className='mb-10 prose max-w-none'>
            <p>{post.content}</p>
          </div>

          <section className='mb-12'>
            <h3 className='mb-3 text-xl font-semibold'>
              Comments ({comments?.length || 0})
            </h3>
            <Textarea
              placeholder='Enter a comment...'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className='mb-2 h-[140px] w-full rounded-xl border'
            />
            <button
              onClick={() => commentMutation.mutate({ content: comment })}
              disabled={!comment || commentMutation.isPending}
              className='w-full py-2 mt-3 text-white bg-blue-500 rounded-full hover:bg-blue-400'
            >
              {commentMutation.isPending ? 'Sending...' : 'Send'}
            </button>

            <div className='mt-6 space-y-4'>
              {visibleComments.map((c: Comment) => (
                <div key={c.id} className='flex gap-3'>
                  <img
                    src='/images/avatar.png'
                    className='w-10 h-10 rounded-full'
                    alt='user'
                  />
                  <div>
                    <p className='font-semibold'>
                      {c.author?.name || 'Anonymous'}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                    <p>{c.content}</p>
                  </div>
                </div>
              ))}
              {comments?.length > 3 && (
                <CommentModal
                  addComment={(val) => commentMutation.mutate({ content: val })}
                  comments={comments}
                  open={showAllComments}
                  onOpenChange={setShowAllComments}
                />
              )}
            </div>
          </section>

          {anotherPost && (
            <div className='pt-2 mt-1 border-t'>
              <h4 className='mb-3 text-xl font-bold'>Another Post</h4>
              <Card className='flex flex-row'>
                <img
                  src={anotherPost.imageUrl || '/images/image.png'}
                  width={340}
                  alt='another'
                  className='hidden rounded-sm md:block'
                />
                <div className='flex-1 px-4'>
                  <CardHeader>
                    <CardTitle
                      onClick={() => navigate(`/detail/${anotherPost.id}`)}
                      className='cursor-pointer'
                    >
                      {anotherPost.title}
                    </CardTitle>
                    <div className='flex gap-2 mt-2'>
                      {anotherPost.tags
                        ?.slice(0, 4)
                        .map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className='px-2 py-1 text-xs border rounded'
                          >
                            {tag.trim()}
                          </span>
                        ))}
                    </div>
                  </CardHeader>
                  <CardDescription className='mt-2'>
                    {anotherPost.content.slice(0, 100)}...
                  </CardDescription>
                  <CardContent className='flex items-center gap-4 mt-4'>
                    <img
                      src={
                        anotherPost.author?.avatarUrl || '/images/avatar.png'
                      }
                      className='w-10 h-10 rounded-full'
                      alt='author'
                    />
                    <span>{anotherPost.author?.name}</span>
                    <div className='w-2 h-2 bg-gray-400 rounded-full' />
                    <span>
                      {new Date(anotherPost.createdAt).toLocaleDateString()}
                    </span>
                  </CardContent>
                  <CardFooter className='gap-4'>
                    <span className='flex items-center gap-1 text-sm text-gray-500'>
                      <img src='/icons/like.svg' alt='like' />{' '}
                      {anotherPost.likes}
                    </span>
                    <span className='flex items-center gap-1 text-sm text-gray-500'>
                      <img src='/icons/comment.svg' alt='comment' />{' '}
                      {anotherPost.comments?.length || 0}
                    </span>
                  </CardFooter>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DetailPost;
