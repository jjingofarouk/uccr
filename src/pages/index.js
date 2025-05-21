import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedCase, getRecentCases, getTrendingCases, getSpecialtyCases, getTopContributors, getCaseStatistics } from '../firebase/firestore';
import { Home, Star } from 'lucide-react';
import styles from './Home.module.css';

const HeroSection = () => (
  <section className={styles.hero}>
    <h1 className={styles.heroTitle}>Welcome to UCCR</h1>
    <p className={styles.heroSubtitle}>
      Share and explore clinical case reports to advance medical knowledge in Uganda.
    </p>
    <div className={styles.heroButtons}>
      <Link href="/cases" className={styles.ctaButtonPrimary}>
        Browse Cases
      </Link>
      <Link href="/cases/new" className={styles.ctaButtonSecondary}>
        Submit a Case
      </Link>
    </div>
  </section>
);

const FeaturedSection = ({ featuredCase }) => {
  if (!featuredCase) {
    return (
      <section className={styles.featuredSection}>
        <h2 className={styles.sectionTitle}>Case of the Day</h2>
        <div className={styles.emptySection}>
          <p className={styles.emptyText}>No featured case available</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.featuredSection}>
      <h2 className={styles.sectionTitle}>Case of the Day</h2>
      <div className={styles.featuredCard}>
        <Link href={`/cases/${featuredCase.id}`} className={styles.caseCardWrapper}>
          <div className={styles.caseCard}>
            <h3 className={styles.caseTitle}>{featuredCase.title || 'Untitled Case'}</h3>
            <p className={styles.caseDescription}>
              {featuredCase.description?.substring(0, 100) || 'No description'}...
            </p>
            <p className={styles.caseMeta}>
              {featuredCase.specialty || 'No specialty'} •{' '}
              {new Date(featuredCase.createdAt?.seconds * 1000).toLocaleDateString()}
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
};

const TrendingSection = ({ trendingCases }) => (
  <section className={styles.trendingSection}>
    <h2 className={styles.sectionTitle}>Trending Cases</h2>
    {trendingCases.length === 0 ? (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No trending cases available</p>
      </div>
    ) : (
      <div className={styles.caseList}>
        {trendingCases.map((caseData) => (
          <Link
            key={caseData.id}
            href={`/cases/${caseData.id}`}
            className={styles.caseCardWrapper}
          >
            <div className={styles.caseCard}>
              <h3 className={styles.caseTitle}>{caseData.title || 'Untitled Case'}</h3>
              <p className={styles.caseDescription}>
                {caseData.description?.substring(0, 100) || 'No description'}...
              </p>
              <p className={styles.caseMeta}>
                {caseData.specialty || 'No specialty'} •{' '}
                {new Date(caseData.createdAt?.seconds * 1000).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    )}
  </section>
);

const RecentSection = ({ recentCases }) => (
  <section className={styles.recentSection}>
    <h2 className={styles.sectionTitle}>Recent Cases</h2>
    {recentCases.length === 0 ? (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No recent cases available</p>
      </div>
    ) : (
      <div className={styles.caseList}>
        {recentCases.map((caseData) => (
          <Link
            key={caseData.id}
            href={`/cases/${caseData.id}`}
            className={styles.caseCardWrapper}
          >
            <div className={styles.caseCard}>
              <h3 className={styles.caseTitle}>{caseData.title || 'Untitled Case'}</h3>
              <p className={styles.caseDescription}>
                {caseData.description?.substring(0, 100) || 'No description'}...
              </p>
              <p className={styles.caseMeta}>
                {caseData.specialty || 'No specialty'} •{' '}
                {new Date(caseData.createdAt?.seconds * 1000).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    )}
  </section>
);

const SpecialtySection = ({ specialtyCases }) => (
  <section className={styles.specialtySection}>
    <h2 className={styles.sectionTitle}>Specialty Spotlight</h2>
    {specialtyCases.length === 0 ? (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No specialty cases available</p>
      </div>
    ) : (
      <div className={styles.caseList}>
        {specialtyCases.map((caseData) => (
          <Link
            key={caseData.id}
            href={`/cases/${caseData.id}`}
            className={styles.caseCardWrapper}
          >
            <div className={styles.caseCard}>
              <h3 className={styles.caseTitle}>{caseData.title || 'Untitled Case'}</h3>
              <p className={styles.caseDescription}>
                {caseData.description?.substring(0, 100) || 'No description'}...
              </p>
              <p className={styles.caseMeta}>
                {caseData.specialty || 'No specialty'} •{' '}
                {new Date(caseData.createdAt?.seconds * 1000).toLocaleDateString()}
              </p>
            </div>
          </Link>
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
    return <div className={styles.errorSection}>{error}</div>;
  }

  if (contributors.length === 0) {
    return (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No contributors found</p>
        <Link href="/cases/new" className={styles.ctaButtonSecondary}>
          Contribute a Case
        </Link>
      </div>
    );
  }

  return (
    <section className={styles.leaderboardSection}>
      <h2 className={styles.sectionTitle}>Top Contributors</h2>
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
    return <div className={styles.errorSection}>{error}</div>;
  }

  if (stats.length === 0) {
    return (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No case statistics available</p>
        <Link href="/cases/new" className={styles.ctaButtonSecondary}>
          Contribute a Case
        </Link>
      </div>
    );
  }

  return (
    <section className={styles.statsSection}>
      <h2 className={styles.sectionTitle}>Case Statistics</h2>
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
                "#17a2b8"
              ],
              "borderColor": [
                "#0056b3",
                "#218838",
                "#c82333",
                "#e0a800",
                "#138496"
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
  const [featuredCase, setFeaturedCase] = useState(null);
  const [trendingCases, setTrendingCases] = useState([]);
  const [recentCases, setRecentCases] = useState([]);
  const [specialtyCases, setSpecialtyCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, trending, recent, specialty] = await Promise.all([
          getFeaturedCase(),
          getTrendingCases(4),
          getRecentCases(4),
          getSpecialtyCases(4),
        ]);
        setFeaturedCase(featured);
        setTrendingCases(trending);
        setRecentCases(recent);
        setSpecialtyCases(specialty);
      } catch (err) {
        setError('Failed to load content');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.loadingSection}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorSection}>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <HeroSection />
      <FeaturedSection featuredCase={featuredCase} />
      <TrendingSection trendingCases={trendingCases} />
      <RecentSection recentCases={recentCases} />
      <SpecialtySection specialtyCases={specialtyCases} />
      <LeaderboardSection />
      <StatsSection />
    </div>
  );
}