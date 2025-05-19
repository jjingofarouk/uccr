// pages/index.jsx
import Navbar from '../components/Navbar';
import Marquee from '../components/Marquee';
import CaseCard from '../components/Case/CaseCard';
import { useCases } from '../hooks/useCases';
import Link from 'next/link';
import styles from './Home.module.css';
import { useState, useEffect } from 'react';

export default function Home() {
  const { cases } = useCases();
  const [caseOfTheDay, setCaseOfTheDay] = useState(null);

  // Select a random case for "Case of the Day"
  useEffect(() => {
    if (cases.length > 0) {
      const randomIndex = Math.floor(Math.random() * cases.length);
      setCaseOfTheDay(cases[randomIndex]);
    }
  }, [cases]);

  // Get the 5 most recent cases
  const recentCases = cases
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <>
      <Navbar />
      <Marquee />
      <main className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Uganda Clinical Case Reports</h1>
          <p className={styles.heroSubtitle}>
            Discover and share medical case studies from Uganda's healthcare community.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/cases" className={styles.ctaButton}>
              Explore Cases
            </Link>
            <Link href="/cases/new" className={styles.ctaButton}>
              Contribute a Case
            </Link>
          </div>
        </section>

        {/* Case of the Day */}
        {caseOfTheDay && (
          <section className={styles.featuredSection}>
            <h2 className={styles.sectionTitle}>Case of the Day</h2>
            <CaseCard caseData={caseOfTheDay} />
          </section>
        )}

        {/* Recently Published Cases */}
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