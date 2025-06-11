import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import YourPosts from './YourPost';
import ChangePasswordForm from './ChangePasswordForm';
import { useState } from 'react';
import ProfileEdit from './EditProfile';
import { useNavigate } from 'react-router-dom';

const ProfileUpdate = () => {
  const { user } = useAuth();
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const Navigate = useNavigate();

  const User = user || {
    name: 'Guest',
    avatarUrl: '/images/avatar.png', // Default avatar for guest
  };

  return (
    <>
      <Navbar />
      <div className='custom-container'>
        <div className='max-w-xl px-4 py-8 mx-auto'>
          <div className='flex flex-row items-center justify-between p-3 border rounded-xl border-neutral-300'>
            <div className='flex flex-row gap-3'>
              <img
                src={User?.avatarUrl || '/images/avatar.png'}
                className='mx-auto h-12.5 w-12.5 rounded-full'
              />
              <div className='flex flex-col flex-start'>
                <span className='text-sm-bold text-neutral-900'>
                  {user?.name}
                </span>
                <span className='text-sm-regular text-neutral-900'>
                  {user?.headline}
                </span>
              </div>
            </div>
            <span
              className='font-bold text-primary-300 text-xs-semibold hover:cursor-pointer hover:text-black hover:underline'
              onClick={() => setOpenEditProfile(true)}
            >
              Edit Profile
            </span>
            <ProfileEdit
              open={openEditProfile}
              onOpenChange={() => setOpenEditProfile(false)}
            />
          </div>

          {/* menu tabs */}
          <Tabs defaultValue='posts' className='w-full max-w-2xl mx-auto mt-8'>
            {/* Tab Buttons */}
            <TabsList className='grid w-full grid-cols-2 border-none shadow-none cursor-pointer bg-none'>
              <TabsTrigger
                value='posts'
                className='text-sm-semibold data-[state=active]:text-primary-300 data-[state=actice]:border-b-1px data-[state=actice]:border-primary-300 cursor-pointer data-[state=active]:shadow-none'
              >
                Your Posts
              </TabsTrigger>

              <TabsTrigger
                value='password'
                className='data-[state=active]:text-primary-300 data-[state=actice]:border-b-1px data-[state=actice]:border-primary-300 cursor-pointer data-[state=active]:shadow-none'
              >
                Change Password
              </TabsTrigger>
            </TabsList>

            <div className='relative'>
              <img
                className='absolute w-5 h-5 top-1/2 left-1/2 -translate-x-15'
                src='/icons/pencil-white.png'
                alt='Write Icon'
              />
              <button
                className='bg-primary-300 hover:bg-primary-200 text-sm-semibold right-0 mt-4 h-[44px] w-full cursor-pointer rounded-full text-white hover:text-black'
                onClick={() => Navigate('/write')}
              >
                Write Post
              </button>
            </div>

            {/* Tab Contents */}
            <TabsContent value='posts' className=''>
              <YourPosts />
            </TabsContent>

            <TabsContent value='password'>
              <ChangePasswordForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ProfileUpdate;
