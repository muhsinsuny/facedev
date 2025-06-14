import { useState } from 'react';
import YourPosts from '../../pages/YourPosts';
import ChangePasswordForm from './../partials/ChangePasswordForm';
import { useNavigate } from 'react-router-dom';

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<'posts' | 'password'>('posts');
  const navigate = useNavigate();

  return (
    <div className='custom-container'>
      <div className='flex flex-col items-center md:w-1/2'>
        <div className='w-full max-w-2xl mx-auto mt-8'>
          {/* Tab Buttons */}
          <div className='flex w-full border-b border-neutral-300'>
            <button
              className={`flex-1 cursor-pointer py-2 text-center text-sm font-semibold transition-all duration-200 ${
                activeTab === 'posts'
                  ? 'border-primary-300 text-primary-300 border-b-3'
                  : 'hover:text-primary-300 text-neutral-700'
              }`}
              onClick={() => setActiveTab('posts')}
            >
              Your Posts
            </button>

            <button
              className={`flex-1 cursor-pointer py-2 text-center text-sm font-semibold transition-all duration-200 ${
                activeTab === 'password'
                  ? 'border-primary-300 text-primary-300 border-b-3'
                  : 'hover:text-primary-300 text-neutral-700'
              }`}
              onClick={() => setActiveTab('password')}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      <button
        className='bg-primary-300 hover:bg-primary-200 text-sm-semibold right-0 mt-4 h-[44px] w-full cursor-pointer rounded-full text-white hover:text-black md:w-[182px]'
        onClick={() => navigate('/write')}
      >
        Write Post
      </button>
      {/* Tab Content */}
      <div className='mt-6'>
        {activeTab === 'posts' && <YourPosts />}
        {activeTab === 'password' && <ChangePasswordForm />}
      </div>
    </div>
  );
}
