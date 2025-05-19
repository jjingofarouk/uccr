// pages/index.jsx
import Navbar from '../components/Navbar';
import Marquee from '../components/Marquee';
import CaseCard from '../components/Case/CaseCard';
import { useCases } from '../hooks/useCases';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Home.module.css';

export default function Home() {
  const { cases } = useCases();
  const [caseOfTheDay, setCaseOfTheDay] = useState(null);

  useEffect(() => {
    if (cases.length > 0) {
      const randomIndex = Math.floor(Math.random() * cases.length);
      setCaseOfTheDay(cases[randomIndex]);
    }
  }, [cases]);

  const recentCases = cases
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <>
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

        {caseOfTheDay && (
          <section className={styles.featuredSection}>
            <h2 className={styles.sectionTitle}>Case of the Day</h2>
            <div className={styles.featuredCard}>
              <CaseCard caseData={caseOfTheDay} />
            </div>
          </section>
        )}

        {recentCases.length > 0 && (
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
    </>
  );
}
