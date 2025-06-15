import { Link, useNavigate } from 'react-router-dom';
import { SearchBox } from '../partials/SearchBox';
import { CiSearch } from 'react-icons/ci';
import { Menu } from 'lucide-react';
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '../../components/ui/sheet';
import { UserDropdown } from '../partials/UserDropdown';
import { useAuth } from '../../context/AuthContext';
import { ShimmerButton } from '../../components/magicui/shimmer-button';

export default function Navbar() {
  const { user } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isHamburgerVisible, setIsHamburgerVisible] = React.useState(false);
  const [isSearchBoxVisible, setIsSearchBoxVisible] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth < 768;
      setIsHamburgerVisible(isSmallScreen);
      setIsSearchBoxVisible(isSmallScreen);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    navigate('/');
  };

  const avatarUrl = user?.avatarUrl || '/images/avatar.png';
  const displayName = user?.name || 'Guest';

  return (
    <nav className='flex items-center justify-between px-4 py-2 border-b custom-container'>
      <div className='flex items-center gap-2'>
        <img
          src='/icons/logo-F.png'
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
        {user ? (
          <>
            <div className='flex flex-row items-center gap-8'>
              <div className='items-center hidden gap-2 md:flex md:flex-row'>
                <img src='/icons/pencil.png' width={18} height={18} />
                <Link
                  to='/write'
                  className='text-sm-semibold text-primary-300 hover:underline'
                >
                  Write Post
                </Link>
              </div>
              <UserDropdown
                user={{ name: displayName, avatarUrl }}
                onLogout={handleLogout}
              />
            </div>
          </>
        ) : (
          <>
            <div className='flex-row items-center hidden gap-12 md:flex'>
              <Link
                to='/login'
                className='text-sm-semibold text-primary-300 hover:underline'
              >
                Login
              </Link>
              <ShimmerButton
                shimmerColor='#ffffff'
                background='#0093dd'
                shimmerSize='0.5em'
                onClick={() => navigate('/register')}
                className='text-sm-semibold bg-primary-300 hover:bg-primary-200 h-[44px] w-[182px] rounded-full px-4 py-2 text-white transition-colors duration-200 hover:cursor-pointer hover:text-black'
              >
                Register
              </ShimmerButton>
            </div>
            <div>
              {isSearchBoxVisible && (
                <Sheet>
                  <SheetTrigger asChild className='md:hidden'>
                    <CiSearch className='fixed w-6 h-6 cursor-pointer top-4 right-13' />
                  </SheetTrigger>
                  <SheetContent>
                    <div className='flex flex-col items-start p-4'>
                      <SearchBox />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              {isHamburgerVisible && (
                <>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Menu className='fixed w-6 h-6 cursor-pointer top-4 right-4' />
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader className='flex flex-col items-start w-full border-b-1 border-neutral-300'>
                        <div className='flex items-center gap-2'>
                          <img
                            src='/icons/logo-F.png'
                            alt='logo'
                            className='h-7.5 w-7.5 hover:cursor-pointer'
                          />
                          <Link to='/' className='text-xl font-bold'>
                            Facedev
                          </Link>
                        </div>
                      </SheetHeader>
                      <div className='flex flex-col items-center w-full mb-4 text-sm-semibold text-primary-300 hover:underline'>
                        <Link to='/login' className='mt-9.75 mb-4'>
                          Login
                        </Link>
                        <button
                          onClick={() => navigate('/register')}
                          className='bg-primary-300 hover:bg-primary-200 mt-2 h-[44px] w-[214px] rounded-full px-4 py-2 text-white transition-colors duration-200 hover:cursor-pointer hover:text-black'
                        >
                          Register
                        </button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
