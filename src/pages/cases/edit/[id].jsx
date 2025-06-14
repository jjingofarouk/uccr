import { useRouter } from 'next/router';
import EditCaseForm from '../../../components/Case/EditCaseForm';
import ProtectedRoute from '../../../components/Auth/ProtectedRoute';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from '../../../styles/caseForm.module.css';

export default function EditCasePage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
        <section className={styles.loadingSection}>
          <Skeleton height={40} width={300} />
          <Skeleton height={20} count={5} style={{ marginTop: '10px' }} />
        </section>
      </SkeletonTheme>
    );
  }

  return (
    <ProtectedRoute>
      <main className={styles.caseFormWrapper}>
        <EditCaseForm caseId={id} />
      </main>
    </ProtectedRoute>
  );
}