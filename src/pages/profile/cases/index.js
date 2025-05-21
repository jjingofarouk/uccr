import { useAuth } from '../../../hooks/useAuth';
import { useCases } from '../../../hooks/useCases';
import CaseCard from '../../../components/Case/CaseCard';
import ProtectedRoute from '../../../components/Auth/ProtectedRoute';
import Link from 'next/link';
import styles from '../../cases/case.module.css';

export default function MyCases() {
  const { user } = useAuth();
  const { cases } = useCases(user?.uid);

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <h1 className={styles.title}>My Cases</h1>
        {cases.length === 0 ? (
          <p>No cases found.</p>
        ) : (
          <div className={styles['case-list']}>
            {cases.map((caseData) => (
              <div key={caseData.id} className={styles.caseWrapper}>
                <CaseCard caseData={caseData} />
                <Link href={`/cases/edit/${caseData.id}`} className={styles.editLink}>
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}