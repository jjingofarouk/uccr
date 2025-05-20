import React from 'react';
import styles from '../../styles/ProfileSkeleton.module.css';

export default function ProfileSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.skeletonCard}>
        <div className={styles.avatarSkeleton}></div>
        <div className={styles.nameSkeleton}></div>
        <div className={styles.detailsSkeleton}>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
          <div className={styles.lineShort}></div>
        </div>
        <div className={styles.buttonSkeleton}></div>
      </div>
    </div>
  );
}