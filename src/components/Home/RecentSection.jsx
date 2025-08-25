import Link from 'next/link';
import CaseCard from '../Case/CaseCard';
import { trackClick, trackEngagement } from '../../utils/analytics';
import styles from '../../pages/Home.module.css';

const RecentSection = ({ recentCases }) => (
  <section className={styles.recentSection} aria-labelledby="recent-title">
    <h2 id="recent-title" className={styles.sectionTitle}>Recently Published Cases</h2>
    {recentCases.length > 0 ? (
      <div className={styles.caseList}>
        {recentCases.map((caseData, index) => (
          <div
            key={caseData.id}
            onClick={() => trackEngagement('view', 'recent_case', `${caseData.id}_position_${index + 1}`)}
          >
            <CaseCard caseData={caseData} />
          </div>
        ))}
      </div>
    ) : (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No recent cases available</p>
        <Link
          href="/cases/new"
          className={styles.ctaButtonSecondary}
          onClick={() => trackClick('share_case_button', 'recent_empty')}
        >
          Share a Case
        </Link>
      </div>
    )}
  </section>
);

export default RecentSection;