import { useState, useEffect, useMemo } from 'react';
import { useCases } from '../hooks/useCases';
import { useAuth } from '../hooks/useAuth';
import { getUsers, getUserStats } from '../firebase/firestore';
import CaseCard from '../components/Case/CaseCard';
import Loading from '../components/Loading';
import Link from 'next/link';
import Marquee from '../components/Marquee';
import Image from 'next/image';
import styles from './Home.module.css';

export default function Home() {
  const { user } = useAuth();
  const { cases, loading, error } = useCases();
  const [caseOfTheDay, setCaseOfTheDay] = useState(null);
  const [featuredSpecialty, setFeaturedSpecialty] = useState('');
  const [topContributors, setTopContributors] = useState([]);

  useEffect(() => {
    if (cases.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
      const randomIndex = seed % cases.length;
      setCaseOfTheDay(cases[randomIndex]);
    }
  }, [cases]);

  useEffect(() => {
    const specialties = [...new Set(cases.map((c) => c.specialty).filter(Boolean))];
    if (specialties.length > 0) {
      const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
      setFeaturedSpecialty(specialties[weekNumber % specialties.length]);
    }
  }, [cases]);

  useEffect(() => {
    const fetchContributors = async () => {
      const users = await getUsers();
      const contributors = await Promise.all(
        users.map(async (user) => {
          const stats = await getUserStats(user.uid);
          return {
            ...user,
            caseCount: stats.cases,
            awards: cases.reduce((sum, c) => sum + (c.userId === user.uid ? c.awards : 0), 0),
          };
        })
      );
      setTopContributors(contributors.sort((a, b) => b.awards - a.awards).slice(0, 5));
    };
    fetchContributors();
  }, [cases]);

  const recentCases = useMemo(() => {
    return cases
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [cases]);

  const trendingCases = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return cases
      .filter((caseData) => new Date(caseData.createdAt) >= oneWeekAgo)
      .sort((a, b) => (b.awards || 0) - (a.awards || 0))
      .slice(0, 3);
  }, [cases]);

  const specialtyCases = useMemo(() => {
    return cases
      .filter((caseData) => caseData.specialty === featuredSpecialty)
      .slice(0, 3);
  }, [cases, featuredSpecialty]);

  const specialtyCounts = useMemo(() => {
    const counts = cases.reduce((acc, caseData) => {
      const specialty = caseData.specialty || 'Other';
      acc[specialty] = (acc[specialty] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([specialty, count]) => ({ specialty, count }));
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

      {loading && (
        <section className={styles.loadingSection}>
          <Loading />
        </section>
      )}

      {!loading && error && (
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

      {!loading && !error && trendingCases.length > 0 && (
        <section className={styles.trendingSection} aria-labelledby="trending-title">
          <h2 id="trending-title" className={styles.sectionTitle}>Trending Cases</h2>
          <div className={styles.caseList}>
            {trendingCases.map((caseData) => (
              <CaseCard key={caseData.id} caseData={caseData} />
            ))}
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

      {!loading && !error && featuredSpecialty && specialtyCases.length > 0 && (
        <section className={styles.specialtySection} aria-labelledby="specialty-title">
          <h2 id="specialty-title" className={styles.sectionTitle}>Specialty Spotlight: {featuredSpecialty}</h2>
          <div className={styles.caseList}>
            {specialtyCases.map((caseData) => (
              <CaseCard key={caseData.id} caseData={caseData} />
            ))}
          </div>
        </section>
      )}

      {!loading && !error && topContributors.length > 0 && (
        <section className={styles.leaderboardSection} aria-labelledby="leaderboard-title">
          <h2 id="leaderboard-title" className={styles.sectionTitle}>Top Contributors</h2>
          <div className={styles.leaderboard}>
            {topContributors.map((user) => (
              <Link key={user.uid} href={`/profile/view/${user.uid}`} className={styles.contributor}>
                <Image
                  src={user.photoURL || '/images/doctor-avatar.jpeg'}
                  alt={user.displayName}
                  width={40}
                  height={40}
                  className={styles.contributorAvatar}
                />
                <div>
                  <span>{user.displayName}</span>
                  <small>{user.caseCount} cases, {user.awards} awards</small>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!loading && !error && specialtyCounts.length > 0 && (
        <section className={styles.statsSection} aria-labelledby="stats-title">
          <h2 id="stats-title" className={styles.sectionTitle}>Case Statistics</h2>
          <canvas id="specialtyChart"></canvas>
          <script>
            {`
              const ctx = document.getElementById('specialtyChart').getContext('2d');
              new Chart(ctx, {
                type: 'bar',
                data: {
                  labels: ${JSON.stringify(specialtyCounts.map((item) => item.specialty))},
                  datasets: [{
                    label: 'Cases by Specialty',
                    data: ${JSON.stringify(specialtyCounts.map((item) => item.count))},
                    backgroundColor: ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1'],
                    borderColor: ['#0056b3', '#218838', '#c82333', '#e0a800', '#138496', '#5a32a3'],
                    borderWidth: 1
                  }]
                },
                options: {
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Number of Cases' }
                    },
                    x: {
                      title: { display: true, text: 'Specialty' }
                    }
                  },
                  plugins: {
                    legend: { display: false }
                  }
                }
              });
            `}
          </script>
        </section>
      )}
    </main>
  );
}