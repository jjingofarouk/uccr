import Link from 'next/link';
import { trackClick } from '../../utils/analytics';
import styles from '../../pages/Home.module.css';

const HeroSection = () => (
  <section className={styles.hero} aria-labelledby="hero-title">
    <h1 id="hero-title" className={styles.heroTitle}>Uganda Clinical Case Reports</h1>
    <p className={styles.heroSubtitle}>
      Explore and contribute to a growing database of medical case studies from Uganda.
    </p>
    <div className={styles.heroButtons}>
      <Link
        href="/cases"
        className={styles.ctaButtonPrimary}
        onClick={() => trackClick('browse_cases_button', 'hero')}
      >
        Browse Cases
      </Link>
      <Link
        href="/cases/new"
        className={styles.ctaButtonSecondary}
        onClick={() => trackClick('share_case_button', 'hero')}
      >
        Share a Case
      </Link>
    </div>
  </section>
);

export default HeroSection;