// src/pages/cases/[id].jsx
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCases } from '../../hooks/useCases';
import CaseDetail from '../../components/Case/CaseDetail';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import Loading from '../../components/Loading';
import styles from '../../styles/casePage.module.css';

export default function CasePage() {
  const router = useRouter();
  const { id } = router.query;
  const { getCaseById } = useCases();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchCase = async () => {
        try {
          const data = await getCaseById(id);
          setCaseData(data);
        } catch (error) {
          console.error('Error fetching case:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCase();
    }
  }, [id, getCaseById]);

  if (loading) {
    return (
      <section className={styles.loadingSection}>
        <Loading />
      </section>
    );
  }

  if (!caseData) {
    return (
      <div className={styles.errorSection} role="alert">
        <p className={styles.errorText}>Case not found</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <CaseDetail caseData={caseData} />
      </div>
    </ProtectedRoute>
  );
}