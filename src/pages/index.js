import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCases } from '../hooks/useCases';
import { useAuth } from '../hooks/useAuth';
import { getTopContributors, getCaseStatistics } from '../firebase/firestore';
import { Home, Star } from 'lucide-react';
import CaseCard from '../components/Case/CaseCard';
import Marquee from '../components/Marquee';
import styles from './Home.module.css';

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

const FeaturedSection = ({ caseOfTheDay }) => {
  if (!caseOfTheDay) {
    return (
      <section className={styles.featuredSection} aria-labelledby="featured-title">
        <h2 id="featured-title" className={styles.sectionTitle}>Case of the Day</h2>
        <div className={styles.emptySection}>
          <p className={styles.emptyText}>No featured case available</p>
          <Link href="/cases/new" className={styles.ctaButtonSecondary}>
            Share a Case
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.featuredSection} aria-labelledby="featured-title">
      <h2 id="featured-title" className={styles.sectionTitle}>Case of the Day</h2>
      <div className={styles.featuredCard}>
        <CaseCard caseData={caseOfTheDay} />
      </div>
    </section>
  );
};

const TrendingSection = ({ trendingCases }) => (
  <section className={styles.trendingSection} aria-labelledby="trending-title">
    <h2 id="trending-title" className={styles.sectionTitle}>Trending Cases</h2>
    {trendingCases.length === 0 ? (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No trending cases available</p>
        <Link href="/cases/new" className={styles.ctaButtonSecondary}>
          Share a Case
        </Link>
      </div>
    ) : (
      <div className={styles.caseList}>
        {trendingCases.map((caseData) => (
          <CaseCard key={caseData.id} caseData={caseData} />
        ))}
      </div>
    )}
  </section>
);

const RecentSection = ({ recentCases }) => (
  <section className={styles.recentSection} aria-labelledby="recent-title">
    <h2 id="recent-title" className={styles.sectionTitle}>Recently Published Cases</h2>
    {recentCases.length === 0 ? (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No recent cases available</p>
        <Link href="/cases/new" className={styles.ctaButtonSecondary}>
          Share a Case
        </Link>
      </div>
    ) : (
      <div className={styles.caseList}>
        {recentCases.map((caseData) => (
          <CaseCard key={caseData.id} caseData={caseData} />
        ))}
      </div>
    )}
  </section>
);

const SpecialtySection = ({ specialtyCases, featuredSpecialty }) => (
  <section className={styles.specialtySection} aria-labelledby="specialty-title">
    <h2 id="specialty-title" className={styles.sectionTitle}>
      Specialty Spotlight: {featuredSpecialty || 'None'}
    </h2>
    {specialtyCases.length === 0 ? (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No specialty cases available</p>
        <Link href="/cases/new" className={styles.ctaButtonSecondary}>
          Share a Case
        </Link>
      </div>
    ) : (
      <div className={styles.caseList}>
        {specialtyCases.map((caseData) => (
          <CaseCard key={caseData.id} caseData={caseData} />
        ))}
      </div>
    )}
  </section>
);

const LeaderboardSection = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const data = await getTopContributors(5);
        setContributors(data);
      } catch (err) {
        setError('Failed to load top contributors');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContributors();
  }, []);

  if (loading) {
    return <div className={styles.loadingSection}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorSection} role="alert">
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (contributors.length === 0) {
    return (
      <div className={styles.emptySection} aria-live="polite">
        <p className={styles.emptyText}>No contributors found</p>
        <Link href="/cases/new" className={styles.ctaButtonSecondary}>
          Contribute a Case
        </Link>
      </div>
    );
  }

  return (
    <section className={styles.leaderboardSection} aria-labelledby="leaderboard-title">
      <h2 id="leaderboard-title" className={styles.sectionTitle}>Top Contributors</h2>
      <div className={styles.leaderboard}>
        {contributors.map((contributor) => (
          <Link
            key={contributor.uid}
            href={`/profile/view/${contributor.uid}`}
            className={styles.contributor}
          >
            <Image
              src={contributor.photoURL}
              alt={`${contributor.displayName}'s avatar`}
              width={40}
              height={40}
              className={styles.contributorAvatar}
            />
            <div>
              <span>{contributor.displayName}</span>
              <small>
                {contributor.caseCount} case{contributor.caseCount !== 1 ? 's' : ''} uploaded
              </small>
              {contributor.awards?.length > 0 && (
                <small className={styles.awards}>
                  {contributor.awards.length} award{contributor.awards.length !== 1 ? 's' : ''}{' '}
                  <Star size={12} />
                </small>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const StatsSection = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getCaseStatistics();
        setStats(data);
      } catch (err) {
        setError('Failed to load case statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className={styles.loadingSection}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorSection} role="alert">
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className={styles.emptySection} aria-live="polite">
        <p className={styles.emptyText}>No case statistics available</p>
        <Link href="/cases/new" className={styles.ctaButtonSecondary}>
          Contribute a Case
        </Link>
      </div>
    );
  }

  return (
    <section className={styles.statsSection} aria-labelledby="stats-title">
      <h2 id="stats-title" className={styles.sectionTitle}>Case Statistics</h2>
      <div className={styles.chartContainer}>
        ```chartjs
        {
          "type": "bar",
          "data": {
            "labels": stats.map(item => item.specialty),
            "datasets": [{
              "label": "Cases by Specialty",
              "data": stats.map(item => item.count),
              "backgroundColor": [
                "#007bff",
                "#28a745",
                "#dc3545",
                "#ffc107",
                "#17a2b8",
                "#6f42c1"
              ],
              "borderColor": [
                "#0056b3",
                "#218838",
                "#c82333",
                "#e0a800",
                "#138496",
                "#5a32a3"
              ],
              "borderWidth": 1
            }]
          },
          "options": {
            "responsive": true,
            "maintainAspectRatio": false,
            "scales": {
              "y": {
                "beginAtZero": true,
                "title": {
                  "display": true,
                  "text": "Number of Cases"
                }
              },
              "x": {
                "title": {
                  "display": true,
                  "text": "Specialty"
                }
              }
            },
            "plugins": {
              "legend": {
                "display": true,
                "position": "top"
              },
              "title": {
                "display": true,
                "text": "Case Distribution by Specialty"
              }
            }
          }
        }
        ```
      </div>
    </section>
  );
};

export default function Home() {
  const { user } = useAuth();
  const { cases, loading, error } = useCases();
  const [caseOfTheDay, setCaseOfTheDay] = useState(null);
  const [featuredSpecialty, setFeaturedSpecialty] = useState('');

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
      .filter((caseData) => caseData.specialty === featuredSpecialty)
      .slice(0, 3);
  }, [cases, featuredSpecialty]);

  return (
    <main className={styles.container}>
      <Marquee />
      <HeroSection />

      {loading && (
        <section className={styles.loadingSection}>
          <div>Loading...</div>
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
        <FeaturedSection caseOfTheDay={caseOfTheDay} />
      )}

      {!loading && !error && trendingCases.length > 0 && (
        <TrendingSection trendingCases={trendingCases} />
      )}

      {!loading && !error && recentCases.length > 0 && (
        <RecentSection recentCases={recentCases} />
      )}

      {!loading && !error && featuredSpecialty && specialtyCases.length > 0 && (
        <SpecialtySection specialtyCases={specialtyCases} featuredSpecialty={featuredSpecialty} />
      )}

      {!loading && !error && <LeaderboardSection />}

      {!loading && !error && <StatsSection />}
    </main>
  );
}