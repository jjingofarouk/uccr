// src/components/Profile/ProfileCard.jsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCases, getComments } from '../../firebase/firestore';
import styles from './profileCard.module.css';

export default function ProfileCard({ userData }) {
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
        // Fetch cases
        const allCases = await getCases();
        const userCases = allCases.filter(caseData => caseData.userId === userData.userId);
        const caseCount = userCases.length;

        // Fetch comments across all cases
        let commentCount = 0;
        let reactionCount = 0;
        const caseIds = allCases.map(caseData => caseData.id);
        for (const caseId of caseIds) {
          const comments = await getComments(caseId);
          const userComments = comments.filter(comment => comment.userId === userData.userId);
          commentCount += userComments.length;

          // Count reactions (upvotes/downvotes) for user's comments
          for (const comment of comments) {
            if (comment.userId === userData.userId) {
              reactionCount += (comment.upvotes || 0) + (comment.downvotes || 0);
            }
          }
        }

        setStats({
          cases: caseCount,
          comments: commentCount,
          reactions: reactionCount,
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load user stats.');
        setLoading(false);
        console.error('Fetch user stats error:', err);
      }
    };

    if (userData.userId) {
      fetchUserStats();
    } else {
      setError('Invalid user data.');
      setLoading(false);
    }
  }, [userData.userId]);

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
            onError={(e) => console.error('Profile image error:', userData.photoURL)}
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
        <Link href={`/profile/view/${userData.userId}`} className={styles.viewButton}>
          View Profile
        </Link>
        <Link href="/profile/edit" className={styles.editButton}>
          Edit
        </Link>
      </div>
    </div>
  );
}
