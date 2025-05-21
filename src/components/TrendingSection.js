import Link from 'next/link';
import CaseCard from './Case/CaseCard';
import styles from '../pages/Home.module.css';

export default function TrendingSection({ trendingCases }) {
  return (
    <section className={styles.trendingSection} aria-labelledby="trending-title">
      <h2 id="trending-title" className={styles.sectionTitle}>Trending Cases</h2>
      {trendingCases && trendingCases.length > 0 ? (
        <div className={styles.caseList}>
          {trendingCases.map((caseData) => (
            <CaseCard key={caseData.id} caseData={caseData} />
          ))}
        </div>
      ) : (
        <div className={styles.emptySection}>
          <p className={styles.emptyText}>No trending cases available</p>
          <Link href="/cases/new" className={styles.ctaButtonSecondary}>
            Share a Case
          </Link>
        </div>
      )}
    </section>
  );
}