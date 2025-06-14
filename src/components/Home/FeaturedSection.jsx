import Link from 'next/link';
import CaseCard from '../Case/CaseCard';
import { trackClick, trackEngagement } from '../../utils/analytics';
import styles from '../../pages/Home.module.css';

const FeaturedSection = ({ caseOfTheDay }) => (
  <section className={styles.featuredSection} aria-labelledby="featured-title">
    <h2 id="featured-title" className={styles.sectionTitle}>Case of the Day</h2>
    {caseOfTheDay ? (
      <div
        className={styles.featuredCard}
        onClick={() => trackEngagement('view', 'featured_case', caseOfTheDay.id)}
      >
        <CaseCard caseData={caseOfTheDay} />
      </div>
    ) : (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No featured case available</p>
        <Link
          href="/cases/new"
          className={styles.ctaButtonSecondary}
          onClick={() => trackClick('share_case_button', 'featured_empty')}
        >
          Share a Case
        </Link>
      </div>
    )}
  </section>
);

export default FeaturedSection;