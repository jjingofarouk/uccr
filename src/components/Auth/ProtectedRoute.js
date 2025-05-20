// src/components/ProtectedRoute.jsx
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import Loading from '../Loading';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [loadStart, setLoadStart] = useState(null);
  const [loadTime, setLoadTime] = useState(null);
  const [forceLoading, setForceLoading] = useState(true);
  const MINIMUM_LOADING_DURATION = 5000; // 2 seconds in milliseconds

  useEffect(() => {
    if (loading || forceLoading) {
      if (!loadStart) {
        setLoadStart(Date.now());
        setLoadTime(null);
      }
    } else if (loadStart) {
      const duration = Date.now() - loadStart;
      setLoadTime(duration);
      console.log(`Loading component displayed for ${duration}ms`);
    }
  }, [loading, forceLoading, loadStart]);

  useEffect(() => {
    if (!loading && user && loadStart) {
      const elapsed = Date.now() - loadStart;
      const remaining = MINIMUM_LOADING_DURATION - elapsed;
      if (remaining > 0) {
        const timer = setTimeout(() => {
          setForceLoading(false);
        }, remaining);
        return () => clearTimeout(timer);
      } else {
        setForceLoading(false);
      }
    }
  }, [loading, user, loadStart]);

  useEffect(() => {
    if (!loading && !forceLoading && !user) {
      router.push('/auth');
    }
  }, [user, loading, forceLoading, router]);

  if (loading || forceLoading) return <Loading />;
  return user ? children : null;
}