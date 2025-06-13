import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';
import { MessageCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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

interface IconDialogProps {
  comments: Comment[];
  addComment: (comment: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IconDialog = ({ addComment, onOpenChange }: IconDialogProps) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const { data: comments } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const res = await api.get(`/comments/${id}/comments`);
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

  const handleClick = () => {
    if (!user) {
      alert(
        'Silakan login terlebih dahulu untuk melihat dan menambahkan komentar.'
      );
      return;
    }
    onOpenChange(true);
  };

  return (
    <>
      <button
        className='flex items-center gap-1 text-gray-600 hover:text-black'
        onClick={handleClick}
      >
        <MessageCircle size={20} />
        {comments?.length || 0}
      </button>

      {user && (
        <div>
          <Dialog>
            <DialogContent className='max-w-md text-md-bold text-neutral-950'>
              <DialogTitle>Comments({comments?.length})</DialogTitle>
              <DialogDescription className='mb-2 text-sm-semibold text-neutral-950'>
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
                  className='text-white bg-primary-300 hover:bg-primary-200 hover:cursor-pointer hover:text-black'
                >
                  Send
                </Button>
              </DialogFooter>

              <h3 className='mb-2 font-medium text-md'>All comments :</h3>
              <div className='overflow-y-auto max-h-100'>
                {comments?.length > 0 ? (
                  comments.map((comment: Comment, index: number) => (
                    <React.Fragment key={comment.id}>
                      <div className='flex items-center justify-between p-2 border-b'>
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
                    </React.Fragment>
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
export default IconDialog;

// import { useState, useEffect, useRef } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '../../components/ui/dialog';
// import { Button } from '../../components/ui/button';
// import { Textarea } from '../../components/ui/textarea';
// import { useAuth } from '../../context/AuthContext';
// import moment from 'moment';
// import { MessageCircle } from 'lucide-react';

// interface Comment {
//   id: string;
//   content: string;
//   createdAt: Date;
//   author?: {
//     id: number;
//     name: string;
//     headline: string;
//     avatarUrl: string;
//   };
// }

// interface IconDialogProps {
//   comments: Comment[];
//   addComment: (comment: string) => void;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// const IconDialog = ({
//   addComment,
//   comments,
//   open,
//   onOpenChange,
// }: IconDialogProps) => {
//   const [newComment, setNewComment] = useState('');
//   const { user } = useAuth();
//   const textAreaRef = useRef<HTMLTextAreaElement>(null);

//   useEffect(() => {
//     if (open && textAreaRef.current) {
//       textAreaRef.current.focus();
//     }
//   }, [open]);

//   const handleSubmit = () => {
//     if (newComment.trim()) {
//       addComment(newComment);
//       setNewComment('');
//     }
//   };

//   const handleClick = () => {
//     if (!user) {
//       alert(
//         'Silakan login terlebih dahulu untuk melihat dan menambahkan komentar.'
//       );
//       return;
//     }
//     onOpenChange(true);
//   };

//   return (
//     <>
//       <button
//         onClick={handleClick}
//         className='flex items-center gap-1 text-gray-600 hover:text-black'
//       >
//         <MessageCircle size={20} />
//       </button>

//       {user && (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//           <DialogContent className='max-w-md text-md-bold text-neutral-950'>
//             <DialogTitle>Comments ({comments?.length})</DialogTitle>
//             <DialogDescription className='mb-2 text-sm-semibold text-neutral-950'>
//               Give your comments
//             </DialogDescription>

//             <Textarea
//               ref={textAreaRef}
//               className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none'
//               placeholder='Enter your comments'
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//             />

//             <DialogFooter>
//               <Button
//                 onClick={handleSubmit}
//                 className='text-white bg-primary-300 hover:bg-primary-200 hover:cursor-pointer hover:text-black'
//               >
//                 Send
//               </Button>
//             </DialogFooter>

//             <h3 className='mb-2 font-medium text-md'>All comments :</h3>
//             <div className='overflow-y-auto max-h-100'>
//               {comments?.length > 0 ? (
//                 comments.map((comment) => (
//                   <div key={comment.id} className='border-b'>
//                     <div className='flex items-center justify-between p-2'>
//                       <div className='flex items-center'>
//                         <img
//                           src={
//                             comment.author?.avatarUrl || '/images/avatar.png'
//                           }
//                           alt={comment.author?.name}
//                           className='w-8 h-8 mr-2 rounded-full'
//                           onError={(e) => {
//                             e.currentTarget.src = '/images/avatar.png';
//                           }}
//                         />
//                         <div>
//                           <p className='font-semibold'>
//                             {comment?.author?.name}
//                           </p>
//                           <p className='text-sm text-gray-500'>
//                             {moment(comment.createdAt).format('DD MMMM YYYY')}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className='p-2'>{comment.content}</div>
//                   </div>
//                 ))
//               ) : (
//                 <p className='text-gray-500'>No comments yet</p>
//               )}
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </>
//   );
// };

// export default IconDialog;
