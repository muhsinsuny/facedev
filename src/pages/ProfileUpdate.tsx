import { useAuth } from '../context/AuthContext';
import Navbar from './partials/Navbar';
import { useState } from 'react';
import ProfileEdit from './EditProfile';
import ProfileTabs from './partials/ProfileTabs';
import Footer from './partials/Footer';
import { ShineBorder } from '../components/magicui/shine-border';

const ProfileUpdate = () => {
  const { user } = useAuth();
  const [openEditProfile, setOpenEditProfile] = useState(false);

  return (
    <>
      {user && (
        <>
          <Navbar />
          <div className='custom-container'>
            <div className='max-w-2xl py-8 mx-auto'>
              <div className='relative flex flex-row items-center justify-between p-3 overflow-hidden border rounded-xl border-neutral-300'>
                <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#ffbe7b']} />
                <div className='flex flex-row gap-3'>
                  <img
                    src={user?.avatarUrl || '/images/avatar.png'}
                    className='mx-auto h-12.5 w-12.5 rounded-full'
                    onError={(e) => {
                      e.currentTarget.src = '/images/avatar.png';
                    }}
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
              <ProfileTabs />
            </div>
          </div>
        </>
      )}
      <Footer />
    </>
  );
};

export default ProfileUpdate;
