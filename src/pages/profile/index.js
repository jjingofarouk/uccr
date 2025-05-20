// src/pages/profile.js
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getProfile } from '../../firebase/firestore';
import ProfileCard from '../../components/Profile/ProfileCard';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import styles from '../../styles/profile.module.css'; // Assuming global container styles

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
        console.log('Fetching profile for user:', user.uid); // Debug
        const profile = await getProfile(user.uid);
        setUserData({
          userId: user.uid, // Map uid to userId
          displayName: profile.displayName || user.displayName || 'User',
          email: profile.email || user.email || 'No email',
          photoURL: profile.photoURL || user.photoURL || '/images/doctor-avatar.jpeg',
          title: profile.title || 'No title',
          specialty: profile.specialty || 'No specialty',
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile.');
        setLoading(false);
        console.error('Fetch profile error:', err);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <Navbar />
          <div className={styles.loading}>Loading profile...</div>
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
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <Navbar />
        <ProfileCard userData={userData} />
        <Footer />
      </div>
    </ProtectedRoute>
  );
}