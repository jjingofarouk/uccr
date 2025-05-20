import styles from './Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loaderContainer} role="status" aria-label="Loading">
      <div className={styles.loader}></div>
    </div>
  );
}