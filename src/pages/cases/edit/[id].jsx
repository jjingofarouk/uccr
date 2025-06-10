// pages/cases/edit/[id].jsx
import { useRouter } from 'next/router';
import EditCaseForm from '../../../components/Case/EditCaseForm';
import ProtectedRoute from '../../../components/Auth/ProtectedRoute';
import Loading from '../../../components/Loading';
import styles from '../../../styles/caseForm.module.css';

export default function EditCasePage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return (
      <section className={styles.loadingSection}>
        <Loading />
      </section>
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