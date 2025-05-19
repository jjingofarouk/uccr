import Link from 'next/link';
import styles from './profileCard.module.css';

export default function ProfileCard({ userData }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.imageContainer}>
          <img
            src={userData.photoURL || '/images/doctor-avatar.jpeg'}
            alt="Profile"
            className={styles.profileImage}
          />
        </div>
        <div className={styles.onlineIndicator}></div>
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.name}>{userData.displayName}</h3>
        <p className={styles.email}>{userData.email}</p>
        
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>24</span>
            <span className={styles.statLabel}>Projects</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>108</span>
            <span className={styles.statLabel}>Tasks</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>7</span>
            <span className={styles.statLabel}>Teams</span>
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