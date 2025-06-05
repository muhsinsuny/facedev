import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../lib/api/auth';
import {useAuth} from '../context/AuthContext'


export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async () => {
      await loginUser( email, password );
      // After successful login, you might want to fetch user data or token
      const user = await loginUser(email, password);
      login(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
      return user;
    },

    onSuccess: () => {
      navigate('/');
    },
  });


  

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 custom-container'>
      <div className='mt-20 h-[398px] w-[345px] max-w-md rounded-xl border bg-white p-6 shadow-md'>
        <h1 className='mb-5 text-xl-bold text-start text-neutral-900'>
          Sign In
        </h1>

        {loginMutation.isError && (
          <Alert variant='destructive' className='mb-4'>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {(loginMutation.error as Error).message}
            </AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginMutation.mutate();
          }}
          className='space-y-4'
        >
          <div>
            <Label className='mb-2 text-sm-semibold' htmlFor='email'>
              Email
            </Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Enter your email'
              className='text-sm-regular focus:border-primary-300 rounded-xl border-neutral-300 text-neutral-500 focus:ring-1'
            />
          </div>

          <div className='relative'>
            <Label className='mb-2 text-sm-semibold' htmlFor='password'>
              Password
            </Label>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Enter your password'
              className='mb-5 text-sm-regular text-neutral-500'
            />
            <button
              type='button'
              className='absolute text-gray-500 cursor-pointer top-8 right-3 hover:text-gray-700'
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type='submit'
            className='w-full h-12 p-2 text-center text-white transition-colors rounded-full bg-primary-300 text-sm-semibold hover:bg-primary-200 hover:cursor-pointer hover:text-black focus:ring-4 focus:ring-blue-300 focus:outline-none'
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>
          <p className='mt-5 text-center text-sm-regular text-neutral-950'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='text-primary-300 text-sm-bold hover:underline'
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
