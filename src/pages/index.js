// src/pages/index.js
import { useState, useEffect, useMemo } from 'react';
import { useCases } from '../hooks/useCases';
import CaseCard from '../components/Case/CaseCard';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import Loading from '../components/Loading'; // Direct import
import Link from 'next/link';
import Marquee from '../components/Marquee';
import styles from './Home.module.css';

export default function Home() {
  const { cases, loading, error } = useCases();
  const [caseOfTheDay, setCaseOfTheDay] = useState(null);

  useEffect(() => {
    if (cases.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
      const randomIndex = seed % cases.length;
      setCaseOfTheDay(cases[randomIndex]);
    }
  }, [cases]);

  const recentCases = useMemo(() => {
    return cases
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [cases]);

  return (
    <ProtectedRoute>
      <Marquee />
      <main className={styles.container}>
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

        {loading && (
          <section className={styles.loadingSection}>
            <Loading />
          </section>
        )}

        {error && (
          <section className={styles.errorSection} role="alert">
            <p className={styles.errorText}>Error: {error}</p>
          </section>
        )}

        {!loading && !error && cases.length === 0 && (
          <section className={styles.emptySection} aria-live="polite">
            <p className={styles.emptyText}>No cases available yet. Be the first to share a case!</p>
            <Link href="/cases/new" className={styles.ctaButtonSecondary}>
              Share a Case
            </Link>
          </section>
        )}

        {!loading && !error && caseOfTheDay && (
          <section className={styles.featuredSection} aria-labelledby="featured-title">
            <h2 id="featured-title" className={styles.sectionTitle}>Case of the Day</h2>
            <div className={styles.featuredCard}>
              <CaseCard key={caseOfTheDay.id} caseData={caseOfTheDay} />
            </div>
          </section>
        )}

        {!loading && !error && recentCases.length > 0 && (
          <section className={styles.recentSection} aria-labelledby="recent-title">
            <h2 id="recent-title" className={styles.sectionTitle}>Recently Published Cases</h2>
            <div className={styles.caseList}>
              {recentCases.map((caseData) => (
                <CaseCard key={caseData.id} caseData={caseData} />
              ))}
            </div>
          </section>
        )}
      </main>
    </ProtectedRoute>
  );
}