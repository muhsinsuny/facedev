import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, loading } = useAuth();

  // Saat masih memuat auth state, jangan render apapun
  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-8 h-8 text-gray-500 animate-spin' />
      </div>
    );
  }

  if (!token) {
    // Jika tidak ada token, redirect ke halaman login
    return <Navigate to='/login' replace />;
  }

  console.log('token', token);
  console.log('user', user);
  console.log('loading', loading);
  return <>{children}</>;
}
