import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getProfile } from '../../firebase/firestore';
import ProfileCard from '../../components/Profile/ProfileCard';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import Loading from '../../components/Loading';
import styles from '../../styles/profile.module.css';

export default function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setError('Please log in to view your profile.');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching profile for uid:', user.uid); // Debug
        const profile = await getProfile(user.uid);
        setUserData({
          uid: user.uid,
          displayName: profile.displayName || user.displayName || 'User',
          email: profile.email || user.email || 'No email',
          photoURL: profile.photoURL || user.photoURL || '/images/doctor-avatar.jpeg',
          title: profile.title || 'No title',
          specialty: profile.specialty || 'No specialty',
          bio: profile.bio || '',
          education: profile.education || '',
          institution: profile.institution || '',
          updatedAt: profile.updatedAt || new Date(),
        });
        console.log('userData set:', { uid: user.uid, ...userData }); // Debug
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile.');
        setLoading(false);
        console.error('Fetch profile error:', err.message);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <Navbar />
          <Loading />
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !userData) {
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <Navbar />
          <div className={styles.error}>{error || 'Invalid user data.'}</div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <Navbar />
        <ProfileCard userData={userData} />
      </div>
    </ProtectedRoute>
  );
}