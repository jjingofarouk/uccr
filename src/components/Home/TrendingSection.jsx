import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { debounce } from 'lodash';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CaseCard from '../Case/CaseCard';
import { trackClick, trackEngagement } from '../../utils/analytics';
import { getTrendingCases } from '../../firebase/firestore'; // Updated import
import styles from '../../pages/Home.module.css';

// Memoized wrapper for CaseCard to prevent unnecessary re-renders
const CaseCardWrapper = memo(({ caseData, index }) => {
  const debouncedTrackEngagement = debounce(trackEngagement, 300);

  return (
    <div
      onClick={() =>
        debouncedTrackEngagement('view', 'trending_case', `${caseData.id}_position_${index + 1}`)
      }
    >
      <CaseCard caseData={caseData} />
    </div>
  );
});

const TrendingSection = () => {
  const [trendingCases, setTrendingCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const casesLimit = 3; // Match getTrendingCases default

  const fetchTrendingCases = async () => {
    try {
      setLoading(true);
      trackEngagement('load_start', 'trending');
      const data = await getTrendingCases(casesLimit);
      setTrendingCases(data);
      trackEngagement('load_success', 'trending', `${data.length}_cases`);
    } catch (err) {
      setError('Failed to load trending cases');
      trackEngagement('load_error', 'trending', err.message);
      console.error('Error fetching trending cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          onClick={fetchTrendingCases}
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
      <h2 id="trending-title" className={styles.sectionTitle}>Trending Cases</h2>
      {trendingCases.length > 0 ? (
        <div className={styles.caseList}>
          {trendingCases.map((caseData, index) => (
            <CaseCardWrapper key={caseData.id} caseData={caseData} index={index} />
          ))}
        </div>
      ) : (
        <div className={styles.emptySection} aria-live="polite">
          <p className={styles.emptyText}>No trending cases available</p>
          <Link
            href="/cases/new"
            className={styles.ctaButtonSecondary}
            onClick={() => trackClick('share_case_button', 'trending_empty')}
          >
            Share a Case
          </Link>
        </div>
      )}
    </section>
  );
};

export default TrendingSection;