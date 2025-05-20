import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../hooks/useAuth';
import { getProfile } from '../../../firebase/firestore';
import ProfileCard from '../../../components/Profile/ProfileCard';
import Navbar from '../../../components/Navbar';
import ProtectedRoute from '../../../components/Auth/ProtectedRoute';
import Loading from '../../../components/Loading';
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
        const profile = await getProfile(userId);
        setProfileData(profile);
        setLoading(false);
        console.log('ProfileView fetched profile:', profile); // Debug
      } catch (err) {
        setError('Failed to load profile.');
        setLoading(false);
        console.error('Profile fetch error:', err);
      }
    };

    fetchProfile();
  }, [userId]);

  if (authLoading || loading) {
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <Navbar />
          <Loading />
        </div>
      </ProtectedRoute>
    );
  }

  if (error) return <div className={styles.error}>{error}</div>;

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