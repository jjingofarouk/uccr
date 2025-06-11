import Link from 'next/link';
import { FileText, Plus, TrendingUp, Users } from 'lucide-react';
import styles from '../pages/Home.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroContent}>
        <div className={styles.heroHeader}>
          <FileText className={styles.heroIcon} size={32} />
          <h1 id="hero-title" className={styles.heroTitle}>
            Uganda Clinical Case Reports
          </h1>
        </div>
        
        <p className={styles.heroSubtitle}>
          Advancing medical knowledge through collaborative case sharing and research insights from Uganda's healthcare community.
        </p>
        
        <div className={styles.heroButtons}>
          <Link href="/cases" className={styles.ctaButtonPrimary}>
            <FileText size={18} />
            Browse Cases
          </Link>
          <Link href="/cases/new" className={styles.ctaButtonSecondary}>
            <Plus size={18} />
            Share Case
          </Link>
        </div>
        
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <TrendingUp size={16} />
            <span>Growing Database</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <Users size={16} />
            <span>Medical Community</span>
          </div>
        </div>
      </div>
    </section>
  );
}