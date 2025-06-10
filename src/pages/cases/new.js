// pages/cases/new.jsx
import CaseForm from '../../components/Case/CaseForm';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import styles from '../../styles/caseForm.module.css';

export default function NewCase() {
  return (
    <ProtectedRoute>
      <main className={styles.caseFormWrapper}>
        <CaseForm />
      </main>
    </ProtectedRoute>
  );
}