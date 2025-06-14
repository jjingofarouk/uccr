import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CaseCard from '../Case/CaseCard';
import { trackEngagement } from '../../utils/analytics';
import { getTrendingCases } from '../../firebase/firestore';
import styles from '../../pages/Home.module.css';

const CaseCardWrapper = memo(({ caseData, index }) => (
  <div onClick={() => trackEngagement('click', 'trending', `${caseData.id}_position_${index}`)}>
    <CaseCard caseData={caseData} />
  </div>
));

const TrendingSection = () => {
  const [trendingCases, setTrendingCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const casesLimit = 3;

  useEffect(() => {
    const fetchTrendingCases = async () => {
      try {
        setLoading(true);
        const data = await getTrendingCases(casesLimit);
        setTrendingCases(data);
      } catch (err) {
        setError('Failed to load trending cases');
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingCases();
  }, []);

  if (loading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
        <section className={styles.trendingSection} aria-labelledby="trending-title">
          <Skeleton height={30} width={200} />
          <div className={styles.caseList}>
            {[...Array(casesLimit)].map((_, index) => (
              <div key={index} className={styles.caseCardSkeleton}>
                <Skeleton height={200} />
              </div>
            ))}
          </div>
        </section>
      </SkeletonTheme>
    );
  }

  if (error) {
    return (
      <section className={styles.errorSection} role="alert">
        <p className={styles.errorText}>{error}</p>
        <button
          className={styles.retryButton}
          onClick={() => {
            setLoading(true);
            setError('');
            fetchTrendingCases();
          }}
          disabled={loading}
          aria-label="Retry loading trending cases"
        >
          {loading ? 'Loading...' : 'Retry'}
        </button>
      </section>
    );
  }

  return (
    <section className={styles.trendingSection} aria-labelledby="trending-title">
      <h2 id="trending-title" className={styles.sectionTitle}>
        Trending Cases
      </h2>
      {trendingCases.length > 0 ? (
        <div className={styles.caseList}>
          {trendingCases.map((caseData, index) => (
            <CaseCardWrapper key={caseData.id} caseData={caseData} index={index} />
          ))}
        </div>
      ) : (
        <div className={styles.emptySection} aria-live="polite">
          <p className={styles.emptyText}>No cases available</p>
          <Link
            href="/cases/new"
            className={styles.ctaButtonSecondary}
            onClick={() => trackEngagement('click', 'trending_empty', 'share_case')}
          >
            Share a Case
          </Link>
        </div>
      )}
    </section>
  );
};

export default TrendingSection;