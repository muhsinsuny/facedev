import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function WritePostNavbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className='flex items-center justify-between px-4 py-3 border-b'>
      <div
        className='flex items-center gap-2 cursor-pointer'
        onClick={() => navigate('/profile')}
      >
        <ArrowLeft className='w-5 h-5' />
        <span className='font-medium'>Write Post</span>
      </div>

      {user && (
        <div className='flex items-center gap-2'>
          <img
            src={user?.avatarUrl || '/images/avatar.png'}
            alt='avatar'
            className='w-8 h-8 rounded-full'
            onError={(e) => {
              e.currentTarget.src = '/images/avatar.png';
            }}
          />
          <span className='hidden text-sm md:block'>{user.name}</span>
        </div>
      )}
    </nav>
  );
}
