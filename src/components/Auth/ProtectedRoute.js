// src/components/ProtectedRoute.jsx
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import Loading from '../Loading';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // Only show loading if user data is still being fetched
  if (loading && !user) return <Loading />;

  // If user is authenticated, render the protected content
  return user ? children : null;
}