// src/pages/index.js
import { useState, useEffect, useMemo } from 'react';
import { useCases } from '../hooks/useCases';
import { useAuth } from '../hooks/useAuth';
import CaseCard from '../components/Case/CaseCard';
import Loading from '../components/Loading';
import Link from 'next/link';
import Marquee from '../components/Marquee';
import styles from './Home.module.css';

export default function Home() {
  const { user } = useAuth();
  const { cases, loading, error } = useCases();
  const [caseOfTheDay, setCaseOfTheDay] = useState(null);
  const [loadStart, setLoadStart] = useState(null);
  const [loadTime, setLoadTime] = useState(null);
  const [forceLoading, setForceLoading] = useState(true);
  const MINIMUM_LOADING_DURATION = 5000; // 5 seconds in milliseconds

  useEffect(() => {
    if ((loading || forceLoading) && user) {
      if (!loadStart) {
        setLoadStart(Date.now());
        setLoadTime(null);
      }
    } else if (loadStart) {
      const duration = Date.now() - loadStart;
      setLoadTime(duration);
      console.log(`Loading component displayed for ${duration}ms`);
    }
  }, [loading, forceLoading, user, loadStart]);

  useEffect(() => {
    if (!loading && cases && loadStart && user) {
      const elapsed = Date.now() - loadStart;
      const remaining = MINIMUM_LOADING_DURATION - elapsed;
      if (remaining > 0) {
        const timer = setTimeout(() => {
          setForceLoading(false);
        }, remaining);
        return () => clearTimeout(timer);
      } else {
        setForceLoading(false);
      }
    }
  }, [loading, cases, loadStart, user]);

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
    <main className={styles.container}>
      <Marquee />
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

      {(loading || forceLoading) && (
        <section className={styles.loadingSection}>
          <Loading />
        </section>
      )}

      {!(loading || forceLoading) && error && (
        <section className={styles.errorSection} role="alert">
          <p className={styles.errorText}>Error: {error}</p>
        </section>
      )}

      {!(loading || forceLoading) && !error && cases.length === 0 && (
        <section className={styles.emptySection} aria-live="polite">
          <p className={styles.emptyText}>No cases available yet. Be the first to share a case!</p>
          <Link href="/cases/new" className={styles.ctaButtonSecondary}>
            Share a Case
          </Link>
        </section>
      )}

      {!(loading || forceLoading) && !error && caseOfTheDay && (
        <section className={styles.featuredSection} aria-labelledby="featured-title">
          <h2 id="featured-title" className={styles.sectionTitle}>Case of the Day</h2>
          <div className={styles.featuredCard}>
            <CaseCard key={caseOfTheDay.id} caseData={caseOfTheDay} />
          </div>
        </section>
      )}

      {!(loading || forceLoading) && !error && recentCases.length > 0 && (
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
  );
}