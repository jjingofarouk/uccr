import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCases } from '../../hooks/useCases';
import CaseDetail from '../../components/Case/CaseDetail';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from '../../styles/casePage.module.css';

function CasePageContent() {
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
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
        <section className={styles.loadingSection}>
          <Skeleton height={40} width={300} />
          <Skeleton height={20} count={3} style={{ marginTop: '10px' }} />
          <Skeleton height={200} style={{ marginTop: '20px' }} />
        </section>
      </SkeletonTheme>
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
    <div className={styles.container}>
      <CaseDetail caseData={caseData} />
    </div>
  );
}

export default function CasePage() {
  return (
    <CasePageContent />
  );
}