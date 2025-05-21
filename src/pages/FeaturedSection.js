import Link from 'next/link';
import CaseCard from '../components/Case/CaseCard';
import styles from './Home.module.css';

export default function FeaturedSection({ caseOfTheDay }) {
  return (
    <section className={styles.featuredSection} aria-labelledby="featured-title">
      <h2 id="featured-title" className={styles.sectionTitle}>Case of the Day</h2>
      {caseOfTheDay ? (
        <div className={styles.featuredCard}>
          <CaseCard caseData={caseOfTheDay} />
        </div>
      ) : (
        <div className={styles.emptySection}>
          <p className={styles.emptyText}>No featured case available</p>
          <Link href="/cases/new" className={styles.ctaButtonSecondary}>
            Share a Case
          </Link>
        </div>
      )}
    </section>
  );
}