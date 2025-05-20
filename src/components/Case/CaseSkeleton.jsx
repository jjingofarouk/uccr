// src/components/Case/CaseSkeleton.jsx
import styles from '../../styles/casePage.module.css';

export default function CaseSkeleton() {
  return (
    <section className={styles.skeletonContainer} aria-label="Loading case details">
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonSubtitle} />
      <div className={styles.skeletonTextBlock} />
      <div className={styles.skeletonTextBlock} />
      <div className={styles.skeletonImage} />
    </section>
  );
}