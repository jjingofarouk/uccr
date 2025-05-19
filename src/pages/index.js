import { useState, useEffect, useMemo } from 'react';
import { useCases } from '../hooks/useCases';
import Navbar from '../components/Navbar';
import Marquee from '../components/Marquee';
import CaseCard from '../components/Case/CaseCard';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import Link from 'next/link';
import styles from './Home.module.css';

export default function Home() {
  const { cases, loading, error } = useCases(); // Assume useCases provides loading and error states
  const [caseOfTheDay, setCaseOfTheDay] = useState(null);

  // Select Case of the Day with stable daily selection
  useEffect(() => {
    if (cases.length > 0) {
      // Use a deterministic seed based on the current date for daily consistency
      const today = new Date().toISOString().split('T')[0];
      const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
      const randomIndex = seed % cases.length;
      setCaseOfTheDay(cases[randomIndex]);
    }
  }, [cases]);

  // Memoize recent cases to prevent unnecessary re-sorting
  const recentCases = useMemo(() => {
    return cases
      .slice() // Create a shallow copy to avoid mutating original array
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [cases]);

  return (
    <ProtectedRoute>
      <Navbar />
      <Marquee />
      <main className={styles.container}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Uganda Clinical Case Reports</h1>
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
            <p className={styles.loadingText}>Loading cases...</p>
          </section>
        )}

        {error && (
          <section className={styles.errorSection}>
            <p className={styles.errorText}>Error: {error}</p>
          </section>
        )}

        {!loading && !error && cases.length === 0 && (
          <section className={styles.emptySection}>
            <p className={styles.emptyText}>No cases available yet. Be the first to share a case!</p>
            <Link href="/cases/new" className={styles.ctaButtonSecondary}>
              Share a Case
            </Link>
          </section>
        )}

        {!loading && !error && caseOfTheDay && (
          <section className={styles.featuredSection}>
            <h2 className={styles.sectionTitle}>Case of the Day</h2>
            <div className={styles.featuredCard}>
              <CaseCard key={caseOfTheDay.id} caseData={caseOfTheDay} />
            </div>
          </section>
        )}

        {!loading && !error && recentCases.length > 0 && (
          <section className={styles.recentSection}>
            <h2 className={styles.sectionTitle}>Recently Published Cases</h2>
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