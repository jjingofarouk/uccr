import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import styles from '../../styles/caseForm.module.css';

export default function LoadingSkeleton() {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
      <div className={styles.caseFormWrapper}>
        <Skeleton height={40} width={300} />
        <Skeleton height={20} count={5} style={{ marginTop: '10px' }} />
      </div>
    </SkeletonTheme>
  );
}