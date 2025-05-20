// src/components/Loading.js
import styles from './Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loaderContainer} role="status" aria-label="Loading cases">
      <div className={styles.loader}></div>
      <p className={styles.loaderText}>Loading cases...</p>
    </div>
  );
}