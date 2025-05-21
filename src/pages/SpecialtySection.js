import Link from 'next/link';
import CaseCard from '../components/Case/CaseCard';
import styles from './Home.module.css';

export default function SpecialtySection({ specialtyCases, featuredSpecialty }) {
  return (
    <section className={styles.specialtySection} aria-labelledby="specialty-title">
      <h2 id="specialty-title" className={styles.sectionTitle}>
        Specialty Spotlight: {featuredSpecialty || 'None'}
      </h2>
      {specialtyCases.length > 0 ? (
        <div className={styles.caseList}>
          {specialtyCases.map((caseData) => (
            <CaseCard key={caseData.id} caseData={caseData} />
          ))}
        </div>
      ) : (
        <div className={styles.emptySection}>
          <p className={styles.emptyText}>No specialty cases available</p>
          <Link href="/cases/new" className={styles.ctaButtonSecondary}>
            Share a Case
          </Link>
        </div>
      )}
    </section>
  );
}