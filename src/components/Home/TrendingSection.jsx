import Link from 'next/link';
import CaseCard from '../Case/CaseCard';
import { trackClick, trackEngagement } from '../../utils/analytics';
import styles from '../../pages/Home.module.css';

const TrendingSection = ({ trendingCases }) => (
  <section className={styles.trendingSection} aria-labelledby="trending-title">
    <h2 id="trending-title" className={styles.sectionTitle}>Trending Cases</h2>
    {trendingCases.length > 0 ? (
      <div className={styles.caseList}>
        {trendingCases.map((caseData, index) => (
          <div
            key={caseData.id}
            onClick={() => trackEngagement('view', 'trending_case', `${caseData.id}_position_${index + 1}`)}
          >
            <CaseCard caseData={caseData} />
          </div>
        ))}
      </div>
    ) : (
      <div className={styles.emptySection}>
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

export default TrendingSection;