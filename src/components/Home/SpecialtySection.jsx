import Link from 'next/link';
import CaseCard from '../Case/CaseCard';
import { trackClick, trackEngagement } from '../../utils/analytics';
import styles from '../../pages/Home.module.css';

const SpecialtySection = ({ specialtyCases, featuredSpecialty }) => (
  <section className={styles.specialtySection} aria-labelledby="specialty-title">
    <h2 id="specialty-title" className={styles.sectionTitle}>
      Specialty Spotlight: {featuredSpecialty || 'None'}
    </h2>
    {specialtyCases.length > 0 ? (
      <div className={styles.caseList}>
        {specialtyCases.map((caseData, index) => (
          <div
            key={caseData.id}
            onClick={() => trackEngagement('view', 'specialty_case', `${featuredSpecialty}_${caseData.id}_position_${index + 1}`)}
          >
            <CaseCard caseData={caseData} />
          </div>
        ))}
      </div>
    ) : (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No specialty cases available</p>
        <Link
          href="/cases/new"
          className={styles.ctaButtonSecondary}
          onClick={() => trackClick('share_case_button', 'specialty_empty')}
        >
          Share a Case
        </Link>
      </div>
    )}
  </section>
);

export default SpecialtySection;