import Link from 'next/link';
import CaseCard from '../components/Case/CaseCard';
import styles from './Home.module.css';

export default function RecentSection({ recentCases }) {
  return (
    <section className={styles.recentSection} aria-labelledby="recent-title">
      <h2 id="recent-title" className={styles.sectionTitle}>Recently Published Cases</h2>
      {recentCases.length > 0 ? (
        <div className={styles.caseList}>
          {recentCases.map((caseData) => (
            <CaseCard key={caseData.id} caseData={caseData} />
          ))}
        </div>
      ) : (
        <div className={styles.emptySection}>
          <p className={styles.emptyText}>No recent cases available</p>
          <Link href="/cases/new" className={styles.ctaButtonSecondary}>
            Share a Case
          </Link>
        </div>
      )}
    </section>
  );
}