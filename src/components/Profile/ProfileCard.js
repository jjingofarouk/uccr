// src/components/Profile/ProfileCard.jsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getUserStats } from '../../firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import styles from './profileCard.module.css';

export default function ProfileCard({ userData }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    cases: 0,
    comments: 0,
    reactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        if (!userData?.uid) {
          throw new Error('Invalid user data: No uid provided');
        }

        console.log('Fetching stats for uid:', userData.uid); // Debug
        const userStats = await getUserStats(userData.uid);
        setStats(userStats);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user stats. Please try again.');
        setLoading(false);
        console.error('Fetch user stats error:', err.message, err.stack); // Debug
      }
    };

    fetchUserStats();
  }, [userData?.uid]);

  if (loading) {
    return <div className={styles.loading}>Loading profile stats...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.imageContainer}>
          <Image
            src={userData.photoURL || '/images/doctor-avatar.jpeg'}
            alt="Profile"
            width={96}
            height={96}
            className={styles.profileImage}
            onError={(e) => {
              console.error('Profile image error:', userData.photoURL); // Debug
              e.target.src = '/images/doctor-avatar.jpeg';
            }}
          />
        </div>
        <div className={styles.onlineIndicator}></div>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.name}>{userData.displayName || 'User'}</h3>
        <p className={styles.email}>{userData.email || 'No email'}</p>
        <p className={styles.title}>{userData.title || 'No title'}</p>
        <p className={styles.specialty}>{userData.specialty || 'No specialty'}</p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{stats.cases}</span>
            <span className={styles.statLabel}>Cases</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{stats.comments}</span>
            <span className={styles.statLabel}>Comments</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{stats.reactions}</span>
            <span className={styles.statLabel}>Reactions</span>
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <Link href={`/profile/view/${userData.uid}`} className={styles.viewButton}>
          View Profile
        </Link>
        {user && user.uid === userData.uid && (
          <Link href="/profile/edit" className={styles.editButton}>
            Edit
          </Link>
        )}
      </div>
    </div>
  );
}