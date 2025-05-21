import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCases } from '../hooks/useCases';
import { useAuth } from '../hooks/useAuth';
import { getTopContributors, getCaseStatistics } from '../firebase/firestore';
import { Star } from 'lucide-react';
import CaseCard from '../components/Case/CaseCard';
import Loading from '../components/Loading';
import styles from './Home.module.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

const LeaderboardSection = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const data = await getTopContributors(3);
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
    return <Loading />;
  }

  if (error) {
    return (
      <div className={styles.errorSection} role="alert">
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <section className={styles.leaderboardSection} aria-labelledby="leaderboard-title">
      <h2 id="leaderboard-title" className={styles.sectionTitle}>Top Contributors</h2>
      {contributors.length > 0 ? (
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
                    {contributor.awards.map((award, index) => (
                      <span
                        key={index}
                        className={
                          award === 'Gold'
                            ? styles.goldAward
                            : award === 'Silver'
                            ? styles.silverAward
                            : styles.bronzeAward
                        }
                      >
                        {award} <Star size={12} />
                      </span>
                    ))}
                  </small>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.emptySection} aria-live="polite">
          <p className={styles.emptyText}>No contributors found</p>
          <Link href="/cases/new" className={styles.ctaButtonSecondary}>
            Contribute a Case
          </Link>
        </div>
      )}
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

  const chartData = {
    labels: stats.map((item) => item.specialty),
    datasets: [
      {
        label: 'Number of Cases',
        data: stats.map((item) => item.count),
        backgroundColor: 'var(--primary)',
        borderColor: 'var(--primary-hover)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Cases',
          color: 'var(--text)',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
            weight: '600',
          },
        },
        ticks: {
          color: 'var(--text)',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
        },
        grid: {
          color: 'var(--border)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Specialty',
          color: 'var(--text)',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
            weight: '600',
          },
        },
        ticks: {
          color: 'var(--text)',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <section className={styles.statsSection} aria-labelledby="stats-title">
      <h2 id="stats-title" className={styles.sectionTitle}>Case Statistics</h2>
      {stats.length > 0 ? (
        <div className={styles.statsContainer}>
          <div className={styles.chartWrapper}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      ) : (
        <div className={styles.emptySection} aria-live="polite">
          <p className={styles.emptyText}>No case statistics available</p>
          <Link href="/cases/new" className={styles.ctaButtonSecondary}>
            Contribute a Case
          </Link>
        </div>
      )}
    </section>
  );
};

export default function HomePage() {
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
    const specialties = [...

new Set(cases.map((c) => c.specialty).filter(Boolean))];
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
      <HeroSection />
      {loading ? (
        <section className={styles.loadingSection}>
          <div>Loading...</div>
        </section>
      ) : error ? (
        <section className={styles.errorSection} role="alert">
          <p className={styles.errorText}>Error: {error}</p>
        </section>
      ) : cases.length === 0 ? (
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
          {featuredSpecialty && <SpecialtySection specialtyCases={specialtyCases} featuredSpecialty={featuredSpecialty} />}
          <StatsSection />
          <LeaderboardSection />
        </>
      )}
    </main>
  );
}