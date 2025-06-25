// pages/cases/edit/[id].jsx
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
    return null;
  }

  return (
    <ProtectedRoute>
      <main className={styles.caseFormWrapper}>
        <EditCaseForm caseId={id} />
      </main>
    </ProtectedRoute>
  );
}