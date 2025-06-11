import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
// import { api } from "../lib/api";
import { updateUserPassword } from '../../lib/api/auth';
import type React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
// import { Form, useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
// import { on } from "events";
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const ChangePasswordForm: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user?.email) throw new Error('User not found');
      return updateUserPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
    },
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => mutation.reset(), 3000);
    },
  });

  return (
    <div className='custom-container mb-4 w-full'>
      {mutation.isError && (
        <Alert
          variant='destructive'
          className='w-full bg-red-200 text-center text-neutral-950'
        >
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(mutation.error as Error).message}
          </AlertDescription>
        </Alert>
      )}

      {mutation.isSuccess && (
        <Alert
          variant='default'
          className='bg-primary-200 w-full text-center text-neutral-950'
        >
          <AlertTitle>Password changed successfully!</AlertTitle>
        </Alert>
      )}
      {/* </Form> */}

      <div className='mt-4'>
        <h3 className='text-sm-semibold mb-1 border-neutral-300 text-neutral-950'>
          Current Password
        </h3>
        <form className='space-y-4'>
          <div className='relative'>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder='Enter current password'
              className='block w-full rounded-xl border p-2 py-2.5 pl-4'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type='button'
              className='absolute top-3 right-4 cursor-pointer text-gray-500 hover:text-gray-700'
              onClick={() => {
                setShowCurrentPassword(!showCurrentPassword);
              }}
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className='relative'>
            <h3 className='text-sm-semibold mt-5 mb-1 text-neutral-950'>
              New Password
            </h3>

            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder='Enter new password'
              className='block w-full rounded-xl border p-2 py-2.5 pl-4'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type='button'
              className='absolute top-11 right-4 cursor-pointer text-gray-500 hover:text-gray-700'
              onClick={() => {
                setShowNewPassword(!showNewPassword);
              }}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className='relative'>
            <h3 className='text-sm-semibold mt-5 mb-4 text-neutral-950'>
              Confirm New Password
            </h3>

            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Enter confirm new password'
              className='block w-full rounded-xl border p-2 py-2.5 pl-4'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type='button'
              className='absolute top-15 right-4 cursor-pointer text-gray-500 hover:text-gray-700'
              onClick={() => {
                setShowConfirmPassword(!showConfirmPassword);
              }}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type='submit'
            className='bg-primary-300 text-neutral-25 text-sm-semibold hover:bg-primary-200 mt-5 w-full rounded-full px-4 py-2 hover:cursor-pointer hover:text-neutral-950'
            onClick={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
