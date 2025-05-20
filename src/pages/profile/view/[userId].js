import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../hooks/useAuth';
import { getProfile } from '../../../firebase/firestore';
import ProfileCard from '../../../components/Profile/ProfileCard';
import Navbar from '../../../components/Navbar';
import ProtectedRoute from '../../../components/Auth/ProtectedRoute';
import ProfileSkeleton from '../../../components/ProfileSkeleton'; // import skeleton loader
import Link from 'next/link';
import styles from '../../../styles/profile.module.css';

export default function ProfileView() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { userId } = router.query;

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true); // ensure loading state true before fetching
        const profile = await getProfile(userId);
        setProfileData(profile);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile.');
        setLoading(false);
        console.error('Profile fetch error:', err);
      }
    };

    fetchProfile();
  }, [userId]);

  // Show loading skeleton while either auth or data loading
  if (authLoading || loading) {
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <Navbar />
          <ProfileSkeleton />
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <Navbar />
          <div className={styles.error}>{error}</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <Navbar />
        {profileData && (
          <>
            <ProfileCard userData={profileData} />
            {user && user.uid !== userId && (
              <Link href={`/inbox?recipient=${userId}`}>
                <button className={styles.messageButton}>Message</button>
              </Link>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}