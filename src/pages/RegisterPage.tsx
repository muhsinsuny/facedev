import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';
import { registerUser } from '../lib/api/auth';
import { Eye, EyeOff } from 'lucide-react';

// 💡 Zod schema untuk validasi register
const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  // const  registerUser  = useAuth();
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setSubmitError('');
    try {
      await registerUser(data.name, data.email, data.password);
      navigate('/login');
    } catch (err) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      }
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='h-[598px] w-[345px] max-w-md rounded-xl border-neutral-200 bg-white p-6 shadow-md'>
        <h1 className='mb-5 text-xl-bold text-neutral-900'>Sign Up</h1>
        {submitError && (
          <p className='mb-4 text-sm text-red-500'>{submitError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className='mb-4 text-sm-semibold text-neutral-950'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              {...register('name')}
              placeholder='Enter your name'
              className='mt-1 text-sm-regular focus:border-primary-300 focus:ring-primary-300 border-neutral-300 text-neutral-500 focus:ring-1'
            />
            {errors.name && (
              <p className='mt-1 text-sm text-red-500'>{errors.name.message}</p>
            )}
          </div>

          <div className='mb-4 text-sm-semibold text-neutral-950'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              {...register('email')}
              placeholder='Enter your email'
              className='mt-1 text-sm-regular focus:border-primary-300 focus:ring-primary-300 border-neutral-300 text-neutral-500 focus:ring-1'
            />
            {errors.email && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className='relative mb-4'>
            <Label
              className='text-sm-semibold text-neutral-950'
              htmlFor='password'
            >
              Password
            </Label>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder='Enter your password'
              className='mt-1 text-sm-regular focus:border-primary-300 focus:ring-primary-300 border-neutral-300 text-neutral-500 focus:ring-1'
            />
            <button
              type='button'
              className='absolute text-gray-500 cursor-pointer top-10 right-3 hover:text-gray-700'
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className='relative mb-4'>
            <Label
              className='text-sm-semibold text-neutral-950'
              htmlFor='confirmPassword'
            >
              Confirm Password
            </Label>
            <Input
              id='confirmPassword'
              type={showPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder='Confirm your password'
              className='mt-1 text-sm-regular focus:border-primary-300 focus:ring-primary-300 border-neutral-300 text-neutral-500 focus:ring-1'
            />
            <button
              type='button'
              className='absolute text-gray-500 cursor-pointer top-10 right-3 hover:text-gray-700'
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className={`text-sm-semibold mt-2 h-12 w-full rounded-full text-white transition ${
              isSubmitting
                ? 'cursor-not-allowed bg-gray-300'
                : 'bg-primary-300 hover:bg-primary-200 hover:cursor-pointer hover:text-black'
            } `}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className='mt-4 text-sm text-center'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='text-primary-300 text-sm-bold hover:underline'
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
