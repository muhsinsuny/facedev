import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Define the expected AuthContext type
type AuthContextType = {
  user: object | null; // Replace 'object' with your actual user type if available
  loading: boolean;
  token?: string;
};

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth() as unknown as AuthContextType;
  const user = useAuth();
  const loading = auth?.loading; // Assuming your AuthContext provides a loading state
  const token = auth?.token; // Assuming your AuthContext provides a token

  // Saat masih memuat auth state, jangan render apapun
  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-8 h-8 text-gray-500 animate-spin' />
      </div>
    );
  }

  if (!user) {
    // Jika tidak ada token, redirect ke halaman login
    return <Navigate to='/login' replace />;
  }

  console.log('token', token);
  console.log('user', user);
  console.log('loading', loading);
  return <>{children}</>;
}
