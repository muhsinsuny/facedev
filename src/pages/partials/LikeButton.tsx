// import React, { useState } from 'react';
// import { api } from '../../lib/api';
// import { useAuth } from '../../context/AuthContext';

// type LikeButtonProps = {
//   postId: string;
//   initialLiked: boolean;
//   initialCount: number;
//   onLikeChange?: (liked: boolean, count: number) => void;
// };

// const LikeButton: React.FC<LikeButtonProps> = ({
//   // postId,
//   initialLiked,
//   initialCount,
//   onLikeChange,
// }) => {
//   const [liked, setLiked] = useState(initialLiked);
//   const { user } = useAuth();
//   const id = user?.id;
//   const [count, setCount] = useState(initialCount);
//   const [loading, setLoading] = useState(false);

//   const toggleLike = async () => {
//     try {
//       setLoading(true);

//       const response = await api.post(`/post/${id}/like`, {
//         method: 'POST',
//       });

//       if (response.status < 200 || response.status >= 300) {
//         throw new Error('Failed to toggle like');
//       }

//       const newLiked = !liked;
//       const newCount = newLiked ? count + 1 : count - 1;

//       setLiked(newLiked);
//       setCount(newCount);

//       if (onLikeChange) {
//         onLikeChange(newLiked, newCount);
//       }
//     } catch (error) {
//       console.error('Error toggling like:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={toggleLike}
//       disabled={loading}
//       style={{
//         color: liked ? 'blue' : 'gray',
//         fontSize: '20px',
//         background: 'none',
//         border: 'none',
//         cursor: 'pointer',
//         display: 'flex',
//         alignItems: 'center',
//         gap: '4px',
//       }}
//     >
//       👍 {count}
//     </button>
//   );
// };

// export default LikeButton;

import React, { useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

type LikeButtonProps = {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  onLikeChange?: (liked: boolean, count: number) => void;
};

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialLiked,
  initialCount,
  onLikeChange,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  // const id = user?.id;

  const toggleLike = async () => {
    try {
      setLoading(true);
      console.log('response', user, postId);
      console.log(token);

      if (user !== null && user !== undefined) {
        if ('token' in user) {
          const response = await api.post(
            `/posts/${postId}/like`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
            }
          );

          if (response.status < 200 || response.status >= 300) {
            throw new Error('Failed to toggle like');
          }
        }
      }

      // Ambil jumlah likes terbaru dari backend
      const updatedPost = await api.get(`/posts/${postId}/likes`);
      setLiked(!liked);
      setCount(updatedPost.data.likes);

      const newLiked = !liked;
      const newCount = newLiked ? count + 1 : count - 1;

      setLiked(newLiked);
      setCount(newCount);

      if (onLikeChange) {
        onLikeChange(newLiked, newCount);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`flex items-center gap-1 text-sm font-medium transition-colors ${
        liked
          ? 'text-blue-600'
          : 'text-gray-500 hover:cursor-pointer hover:text-blue-500'
      } disabled:opacity-50`}
    >
      <FaThumbsUp className='text-base' />
      {count}
    </button>
  );
};

export default LikeButton;
