import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/api';

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

interface CommentModalProps {
  comments: Comment[];
  addComment: (comment: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommentModal = ({ addComment }: CommentModalProps) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const { data: comments } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const res = await api.get(`/posts/${id}/comments`);
      return res.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const handleSubmit = () => {
    if (newComment.trim()) {
      addComment(newComment);
      setNewComment('');
    }
  };

  return (
    <>
      {user && (
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className='text-primary-300 hover:cursor-pointer hover:text-black hover:underline'
                variant='outline'
              >
                See All Comments
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-md text-md-bold text-neutral-950'>
              <DialogTitle>Comments({comments?.length})</DialogTitle>
              <DialogDescription className='text-sm-semibold text-neutral-950'>
                Give your comments
              </DialogDescription>

              <Textarea
                className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none'
                placeholder='Enter your comments'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />

              <DialogFooter>
                <Button
                  onClick={handleSubmit}
                  className='bg-primary-300 hover:bg-primary-200 h-[40px] w-full rounded-full text-white hover:cursor-pointer hover:text-black md:h-[48px] md:w-[204px]'
                >
                  Send
                </Button>
              </DialogFooter>

              <div className='overflow-y-auto max-h-40'>
                {comments?.length > 0 ? (
                  comments.map((comment: Comment, index: number) => (
                    <>
                      <div
                        key={index}
                        className='flex items-center justify-between p-2'
                      >
                        <div className='flex items-center'>
                          <img
                            src={
                              comment.author?.avatarUrl || '/images/avatar.png'
                            }
                            alt={comment.author?.name}
                            className='w-8 h-8 mr-2 rounded-full'
                            onError={(e) => {
                              e.currentTarget.src = '/images/avatar.png';
                            }}
                          />
                          <div>
                            <p className='font-semibold'>
                              {comment?.author?.name}
                            </p>
                            <p className='text-sm text-gray-500'>
                              {moment(comment.createdAt).format('DD MMMM YYYY')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div key={index} className='p-2 border-b'>
                        {comment.content}
                      </div>
                    </>
                  ))
                ) : (
                  <p className='text-gray-500'>No comments yet</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};
export default CommentModal;
