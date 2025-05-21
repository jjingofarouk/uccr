import { useAuth } from '../../../hooks/useAuth';
import { useCases } from '../../../hooks/useCases';
import CaseCard from '../../../components/Case/CaseCard';
import ProtectedRoute from '../../../components/Auth/ProtectedRoute';
import Link from 'next/link';
import Loading from '../../../components/Loading';
import styles from '../../cases/case.module.css';

export default function MyCases() {
  const { user, loading: authLoading } = useAuth();
  const { cases, loading: casesLoading } = useCases(user?.uid);

  if (authLoading || casesLoading) {
    return <Loading />;
  }

  if (!user) {
    return <div>Please log in to view your cases.</div>;
  }

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