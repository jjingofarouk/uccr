import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useCases } from '../hooks/useCases';
import { useAuth } from '../hooks/useAuth';
import { getCases } from '../firebase/firestore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CaseCard from '../components/Case/CaseCard';
import styles from './Home.module.css';

// Dynamic imports to disable SSR for react-query components
const StatsSection = dynamic(() => import('../components/StatsSection'), { ssr: false });
const LeaderboardSection = dynamic(() => import('../components/LeaderboardSection'), { ssr: false });

const HeroSection = () => (
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

const FeaturedSection = ({ caseOfTheDay }) => (
  <section className={styles.featuredSection} aria-labelledby="featured-title">
    <h2 id="featured-title" className={styles.sectionTitle}>Case of the Day</h2>
    {caseOfTheDay ? (
      <div className={styles.featuredCard}>
        <CaseCard caseData={caseOfTheDay} />
      </div>
    ) : (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No featured case available</p>
        <Link href="/cases/new" className={styles.ctaButtonSecondary}>
          Share a Case
        </Link>
      </div>
    )}
  </section>
);

const TrendingSection = ({ trendingCases }) => (
  <section className={styles.trendingSection} aria-labelledby="trending-title">
    <h2 id="trending-title" className={styles.sectionTitle}>Trending Cases</h2>
    {trendingCases.length > 0 ? (
      <div className={styles.caseList}>
        {trendingCases.map((caseData) => (
          <CaseCard key={caseData.id} caseData={caseData} />
        ))}
      </div>
    ) : (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No trending cases available</p>
        <Link href="/cases/new" className={styles.ctaButtonSecondary}>
          Share a Case
        </Link>
      </div>
    )}
  </section>
);

const RecentSection = ({ recentCases }) => (
  <section className={styles.recentSection} aria-labelledby="recent-title">
    <h2 id="recent-title" className={styles.sectionTitle}>Recently Published Cases</h2>
    {recentCases.length > 0 ? (
      <div className={styles.caseList}>
        {recentCases.map((caseData) => (
          <CaseCard key={caseData.id} caseData={caseData} />
        ))}
      </div>
    ) : (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No recent cases available</p>
        <Link href="/cases/new" className={styles.ctaButtonSecondary}>
          Share a Case
        </Link>
      </div>
    )}
  </section>
);

const SpecialtySection = ({ specialtyCases, featuredSpecialty }) => (
  <section className={styles.specialtySection} aria-labelledby="specialty-title">
    <h2 id="specialty-title" className={styles.sectionTitle}>
      Specialty Spotlight: {featuredSpecialty || 'None'}
    </h2>
    {specialtyCases.length > 0 ? (
      <div className={styles.caseList}>
        {specialtyCases.map((caseData) => (
          <CaseCard key={caseData.id} caseData={caseData} />
        ))}
      </div>
    ) : (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No specialty cases available</p>
        <Link href="/cases/new" className={styles.ctaButtonSecondary}>
          Share a Case
        </Link>
      </div>
    )}
  </section>
);

export default function HomePage({ initialCases = [] }) {
  const { user } = useAuth();
  const { cases: clientCases, loading, error, loadMore, hasMore } = useCases(null, 10);
  const [caseOfTheDay, setCaseOfTheDay] = useState(null);
  const [featuredSpecialty, setFeaturedSpecialty] = useState('');

  // Use clientCases if available, fallback to initialCases
  const cases = clientCases.length > 0 ? clientCases : initialCases;

  useEffect(() => {
    if (cases.length > 0) {
      const now = new Date();
      const eatOffset = 3 * 60 * 60 * 1000;
      const eatDate = new Date(now.getTime() + eatOffset);
      const dateString = eatDate.toISOString().split('T')[0];
      const seed = dateString
        .split('-')
        .reduce((acc, val) => acc + parseInt(val), 0);
      const randomIndex = seed % cases.length;
      setCaseOfTheDay(cases[randomIndex]);
    }
  }, [cases]);

  useEffect(() => {
    const specialties = [
      ...new Set(
        cases
          .flatMap((c) => Array.isArray(c.specialty) ? c.specialty : [])
          .filter(Boolean)
      ),
    ];
    if (specialties.length > 0) {
      const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
      setFeaturedSpecialty(specialties[weekNumber % specialties.length]);
    }
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
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 3);
  }, [cases]);

  const specialtyCases = useMemo(() => {
    return cases
      .filter((caseData) => Array.isArray(caseData.specialty) && caseData.specialty.includes(featuredSpecialty))
      .slice(0, 3);
  }, [cases, featuredSpecialty]);

  if (loading && cases.length === 0) {
    return (
      <main className={styles.container}>
        <HeroSection />
        <section className={styles.loadingSection}>
          <Skeleton height={200} count={3} />
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.container}>
        <HeroSection />
        <section className={styles.errorSection} role="alert">
          <p className={styles.errorText}>Error: {error}</p>
          <button onClick={() => window.location.reload()} className={styles.ctaButtonSecondary}>
            Retry
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <HeroSection />
      {cases.length === 0 ? (
        <section className={styles.emptySection} aria-live="polite">
          <p className={styles.emptyText}>No cases available yet. Be the first to share a case!</p>
          <Link href="/cases/new" className={styles.ctaButtonSecondary}>
            Share a Case
          </Link>
        </section>
      ) : (
        <>
          <FeaturedSection caseOfTheDay={caseOfTheDay} />
          <TrendingSection trendingCases={trendingCases} />
          <RecentSection recentCases={recentCases} />
          {featuredSpecialty && (
            <SpecialtySection
              specialtyCases={specialtyCases}
              featuredSpecialty={featuredSpecialty}
            />
          )}
          <StatsSection />
          <LeaderboardSection />
          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <button
                onClick={loadMore}
                disabled={loading}
                className={styles.ctaButtonSecondary}
              >
                {loading ? 'Loading...' : 'Load More Cases'}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export async function getStaticProps() {
  try {
    const { cases } = await getCases(null, 10);
    return {
      props: {
        initialCases: cases || [],
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        initialCases: [],
      },
      revalidate: 60,
    };
  }
}