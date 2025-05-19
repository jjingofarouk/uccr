// components/ProfileCard.jsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './profileCard.module.css';

export default function ProfileCard({ userData }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.imageContainer}>
          <Image
            src={userData.photoURL || '/images/doctor-avatar.jpeg'}
            alt="Profile"
            width={80}
            height={80}
            className={styles.profileImage}
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
            <span className={styles.statNumber}>24</span>
            <span className={styles.statLabel}>Cases</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>108</span>
            <span className={styles.statLabel}>Comments</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>7</span>
            <span className={styles.statLabel}>Reactions</span>
          </div>
        </div>
      </div>
      
      <div className={styles.actions}>
        <Link href="/profile/view" className={styles.viewButton}>View Profile</Link>
        <Link href="/profile/edit" className={styles.editButton}>Edit</Link>
      </div>
    </div>
  );
}
