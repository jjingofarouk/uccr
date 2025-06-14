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
          <article className={styles.caseDetail}>
            <header className={styles.header}>
              <Skeleton height={40} width="80%" />
              <div className={styles.meta}>
                <div className={styles.author}>
                  <Skeleton circle width={40} height={40} />
                  <Skeleton width={100} />
                </div>
                <Skeleton width={150} />
              </div>
            </header>

            <div className={styles.voteSection}>
              <Skeleton height={40} width={100} />
            </div>

            <section className={styles.content}>
              {[...Array(11)].map((_, index) => (
                <div key={index} className={styles.section}>
                  <Skeleton height={24} width="50%" />
                  <Skeleton count={3} />
                </div>
              ))}
            </section>

            <section className={styles.media}>
              <Skeleton height={24} width="50%" />
              <div className={styles.mediaGrid}>
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} width={600} height={400} />
                ))}
              </div>
            </section>

            <Skeleton height={100} count={3} />
          </article>
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