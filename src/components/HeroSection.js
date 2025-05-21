import Link from 'next/link';
import styles from '../pages/Home.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <h1 id="hero-title" className={styles.heroTitle}>Uganda Clinical Case Reports</h1>
      <p className={styles.heroSubtitle}>
        Explore and contribute to a growing database of medical case studies from Uganda.
      </p>
      <div className={styles.heroButtons}>
        <Link href="/cases" className={styles.ctaButtonPrimary}>
          Browse Cases
        </Link>
        <Link href="/cases/new" className={styles.ctaButtonSecondary}>
          Share a Case
        </Link>
      </div>
    </section>
  );
}