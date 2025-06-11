// components/UserDropdown.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

export function UserDropdown({
  user,
  onLogout,
}: {
  user: { name: string; avatarUrl: string };
  onLogout: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='flex items-center gap-2 cursor-pointer'>
          <img
            src={user.avatarUrl}
            alt='avatar'
            className='w-8 h-8 rounded-full'
          />
          <span className='hidden text-sm font-medium md:block'>
            {user.name}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='cursor-pointer w-44'>
        <DropdownMenuItem asChild className='flex flex-row cursor-pointer'>
          <div>
            <img
              src='/icons/Icon-profile.png'
              alt='Profile Icon'
              className='mr-2 h-2.75 w-3 md:h-3.5 md:w-3.75'
            />
            <Link to='/profile'>Profile</Link>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className='flex flex-row cursor-pointer'
          onClick={onLogout}
        >
          <div>
            <img
              src='/icons/icon-logout.png'
              alt='Profile Icon'
              className='mr-2 h-3 w-3.25 md:h-3.75 md:w-4.25'
            />
            <span>Logout</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
