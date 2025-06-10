import { useRouter } from 'next/router';
import EditCaseForm from '../../../components/Case/EditCaseForm';
import ProtectedRoute from '../../../components/Auth/ProtectedRoute';
import Loading from '../../../components/Loading';
import styles from '../../stylescaseForm.module.css'; // Add this import

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
      <div className={styles.container}>
        <EditCaseForm caseId={id} />
      </div>
    </ProtectedRoute>
  );
}