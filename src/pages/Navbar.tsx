import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { SearchBox } from './SearchBox';
import { CiSearch } from 'react-icons/ci';
import { Menu } from 'lucide-react';
import React from 'react';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!sessionStorage.getItem('accessToken');
  const [showHamburger, setShowHamburger] = React.useState(false);

  const User = user || {
    name: 'Guest',
    avatarUrl: '/images/avatar.png', // Default avatar for guest
  };

  return (
    <nav className='custom-container flex items-center justify-between border-b px-4 py-2'>
      <div className='flex items-center gap-2'>
        <img
          src='icons/F.png'
          alt='logo'
          className='h-7.5 w-7.5 hover:cursor-pointer'
        />
        <Link to='/' className='text-xl font-bold'>
          Facedev
        </Link>
      </div>
      <div className='hidden md:flex'>
        <SearchBox />
      </div>
      <div className='flex items-center gap-4'>
        {isLoggedIn && User ? (
          <>
            <div className='flex flex-row items-center gap-8'>
              <div className='hidden items-center gap-2 md:flex md:flex-row'>
                <img src='icons/pencil.png' width={18} height={18} />
                <Link
                  to='/write'
                  className='text-sm-semibold text-primary-300 hover:underline'
                >
                  Write Post
                </Link>
              </div>
              <div className='flex items-center gap-4'>
                <img
                  src={User?.avatarUrl}
                  alt='avatar'
                  className='h-8 w-8 rounded-full'
                />
                <span className='text-sm-medium hidden text-neutral-900'>
                  {User?.name}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='hidden flex-row items-center gap-12 md:flex'>
              <Link
                to='/login'
                className='text-sm-semibold text-primary-300 hover:underline'
              >
                Login
              </Link>
              <button
                onClick={() => navigate('/register')}
                className='text-sm-semibold bg-primary-300 hover:bg-primary-200 h-[44px] w-[182px] rounded-full px-4 py-2 text-white transition-colors duration-200 hover:cursor-pointer hover:text-black'
              >
                Register
              </button>
            </div>
            <div>
              <CiSearch className='flex h-6 w-6 md:hidden' />
              {showHamburger && <Menu />}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
