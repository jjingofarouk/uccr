// src/pages/profile/index.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getProfile } from '../../firebase/firestore';
import ProfileCard from '../../components/Profile/ProfileCard';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import ProfileSkeleton from '../../components/ProfileSkeleton';
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
        console.log('Fetching profile for uid:', user.uid);
        const profile = await getProfile(user.uid);
        setUserData({
          uid: user.uid,
          role: profile.role || '',
          displayName: profile.displayName || user.displayName || 'User',
          email: profile.email || user.email || '',
          photoURL: profile.photoURL || user.photoURL || '/images/doctor-avatar.jpeg',
          title: profile.title || '',
          education: profile.education || '',
          institution: profile.institution || '',
          specialty: profile.specialty || '',
          bio: profile.bio || '',
          linkedIn: profile.linkedIn || '',
          xProfile: profile.xProfile || '',
          researchInterests: Array.isArray(profile.researchInterests) ? profile.researchInterests : [],
          certifications: Array.isArray(profile.certifications) ? profile.certifications : [],
          yearsOfExperience: profile.yearsOfExperience || '',
          professionalAffiliations: Array.isArray(profile.professionalAffiliations)
            ? profile.professionalAffiliations
            : [],
          levelOfStudy: profile.levelOfStudy || '',
          courseOfStudy: profile.courseOfStudy || '',
          updatedAt: profile.updatedAt || new Date(),
        });
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
          <ProfileSkeleton />
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
        <ProfileCard userData={userData} />

      </div>
    </ProtectedRoute>
  );
}