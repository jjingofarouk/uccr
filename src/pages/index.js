import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCases } from '../hooks/useCases';
import { useAuth } from '../hooks/useAuth';
import { getTopContributors, getCaseStatistics } from '../firebase/firestore';
import { Star } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import CaseCard from '../components/Case/CaseCard';
import Loading from '../components/Loading';
import styles from './Home.module.css';
import { GoogleAnalytics } from '@next/third-parties/google';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

// Google Analytics tracking functions
const trackEvent = (action, category, label = '', value = 0) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

const trackPageView = (page_title, page_location) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-GLWW8HX76X', {
      page_title: page_title,
      page_location: page_location,
    });
  }
};

const trackClick = (element_name, section) => {
  trackEvent('click', 'navigation', `${section}_${element_name}`);
};

const trackEngagement = (action, section, details = '') => {
  trackEvent(action, 'engagement', `${section}_${details}`);
};

const HeroSection = () => (
  <section className={styles.hero} aria-labelledby="hero-title">
    <h1 id="hero-title" className={styles.heroTitle}>Uganda Clinical Case Reports</h1>
    <p className={styles.heroSubtitle}>
      Explore and contribute to a growing database of medical case studies from Uganda.
    </p>
    <div className={styles.heroButtons}>
      <Link 
        href="/cases" 
        className={styles.ctaButtonPrimary}
        onClick={() => trackClick('browse_cases_button', 'hero')}
      >
        Browse Cases
      </Link>
      <Link 
        href="/cases/new" 
        className={styles.ctaButtonSecondary}
        onClick={() => trackClick('share_case_button', 'hero')}
      >
        Share a Case
      </Link>
    </div>
  </section>
);

const FeaturedSection = ({ caseOfTheDay }) => (
  <section className={styles.featuredSection} aria-labelledby="featured-title">
    <h2 id="featured-title" className={styles.sectionTitle}>Case of the Day</h2>
    {caseOfTheDay ? (
      <div 
        className={styles.featuredCard}
        onClick={() => trackEngagement('view', 'featured_case', caseOfTheDay.id)}
      >
        <CaseCard caseData={caseOfTheDay} />
      </div>
    ) : (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No featured case available</p>
        <Link 
          href="/cases/new" 
          className={styles.ctaButtonSecondary}
          onClick={() => trackClick('share_case_button', 'featured_empty')}
        >
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
        {trendingCases.map((caseData, index) => (
          <div
            key={caseData.id}
            onClick={() => trackEngagement('view', 'trending_case', `${caseData.id}_position_${index + 1}`)}
          >
            <CaseCard caseData={caseData} />
          </div>
        ))}
      </div>
    ) : (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No trending cases available</p>
        <Link 
          href="/cases/new" 
          className={styles.ctaButtonSecondary}
          onClick={() => trackClick('share_case_button', 'trending_empty')}
        >
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
        {recentCases.map((caseData, index) => (
          <div
            key={caseData.id}
            onClick={() => trackEngagement('view', 'recent_case', `${caseData.id}_position_${index + 1}`)}
          >
            <CaseCard caseData={caseData} />
          </div>
        ))}
      </div>
    ) : (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No recent cases available</p>
        <Link 
          href="/cases/new" 
          className={styles.ctaButtonSecondary}
          onClick={() => trackClick('share_case_button', 'recent_empty')}
        >
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
        {specialtyCases.map((caseData, index) => (
          <div
            key={caseData.id}
            onClick={() => trackEngagement('view', 'specialty_case', `${featuredSpecialty}_${caseData.id}_position_${index + 1}`)}
          >
            <CaseCard caseData={caseData} />
          </div>
        ))}
      </div>
    ) : (
      <div className={styles.emptySection}>
        <p className={styles.emptyText}>No specialty cases available</p>
        <Link 
          href="/cases/new" 
          className={styles.ctaButtonSecondary}
          onClick={() => trackClick('share_case_button', 'specialty_empty')}
        >
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
        trackEngagement('load_start', 'leaderboard');
        const data = await getTopContributors(3);
        setContributors(data);
        trackEngagement('load_success', 'leaderboard', `${data.length}_contributors`);
      } catch (err) {
        setError('Failed to load top contributors');
        trackEngagement('load_error', 'leaderboard', err.message);
        console.error('Error fetching contributors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContributors();
  }, []);

  if (loading) return <Loading />;
  if (error) return (
    <section className={styles.errorSection} role="alert">
      <p className={styles.errorText}>{error}</p>
    </section>
  );

  return (
    <section className={styles.leaderboardSection} aria-labelledby="leaderboard-title">
      <h2 id="leaderboard-title" className={styles.sectionTitle}>Top Contributors</h2>
      {contributors.length > 0 ? (
        <div className={styles.leaderboard}>
          {contributors.map((contributor, index) => (
            <Link
              key={contributor.uid}
              href={`/profile/view/${contributor.uid}`}
              className={styles.contributor}
              onClick={() => trackClick('contributor_profile', 'leaderboard', `${contributor.displayName}_position_${index + 1}`)}
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
                    {contributor.awards.map((award, awardIndex) => (
                      <span
                        key={awardIndex}
                        className={
                          award === 'Gold'
                            ? styles.goldAward
                            : award === 'Silver'
                            ? styles.silverAward
                            : styles.bronzeAward
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          trackEngagement('award_click', 'leaderboard', `${award}_${contributor.displayName}`);
                        }}
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
          <Link 
            href="/cases/new" 
            className={styles.ctaButtonSecondary}
            onClick={() => trackClick('contribute_case_button', 'leaderboard_empty')}
          >
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
        trackEngagement('load_start', 'stats');
        const data = await getCaseStatistics();
        const topStats = data
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setStats(topStats);
        trackEngagement('load_success', 'stats', `${topStats.length}_specialties`);
        
        // Track the top specialties
        topStats.forEach((stat, index) => {
          trackEvent('specialty_stat', 'stats', `${stat.specialty}_rank_${index + 1}`, stat.count);
        });
      } catch (err) {
        setError('Unable to load case statistics');
        trackEngagement('load_error', 'stats', err.message);
        console.error('Error fetching case statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Chart interaction tracking
  const handleChartClick = (event, elements) => {
    if (elements.length > 0) {
      const elementIndex = elements[0].index;
      const specialty = stats[elementIndex]?.specialty;
      const count = stats[elementIndex]?.count;
      trackEngagement('chart_click', 'stats', `${specialty}_${count}_cases`);
    }
  };

  const barColors = [
    'rgba(59, 130, 246, 0.6)',
    'rgba(239, 68, 68, 0.6)',
    'rgba(34, 197, 94, 0.6)',
    'rgba(249, 115, 22, 0.6)',
    'rgba(168, 85, 247, 0.6)',
  ];

  const borderColors = [
    'rgba(59, 130, 246, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(249, 115, 22, 1)',
    'rgba(168, 85, 247, 1)',
  ];

  const chartData = {
    labels: stats.map((item) => item.specialty),
    datasets: [
      {
        label: 'Number of Cases',
        data: stats.map((item) => item.count),
        backgroundColor: barColors,
        borderColor: borderColors,
        borderWidth: 1,
        hoverBackgroundColor: barColors.map(color => color.replace('0.6', '0.8')),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleChartClick,
    onHover: (event, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const specialty = stats[elementIndex]?.specialty;
        trackEngagement('chart_hover', 'stats', specialty);
      }
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Top 5 Specialties by Case Count',
        color: 'var(--text, #1f2937)',
        font: { family: 'Inter, sans-serif', size: 16, weight: '600' },
      },
      tooltip: {
        backgroundColor: 'var(--tooltip-background, rgba(0, 0, 0, 0.8))',
        titleColor: 'var(--tooltip-text, #ffffff)',
        bodyColor: 'var(--tooltip-text, #ffffff)',
        borderColor: 'var(--border, #e5e7eb)',
        borderWidth: 1,
        callbacks: {
          afterLabel: function(context) {
            // Track tooltip views
            trackEngagement('tooltip_view', 'stats', `${context.label}_${context.parsed.y}_cases`);
            return '';
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Cases',
          color: 'var(--text, #1f2937)',
          font: { family: 'Inter, sans-serif', size: 12, weight: '600' },
        },
        ticks: {
          color: 'var(--text, #1f2937)',
          font: { family: 'Inter, sans-serif', size: 12 },
          stepSize: 1,
        },
        grid: { color: 'var(--border, #e5e7eb)' },
      },
      x: {
        title: {
          display: true,
          text: 'Specialty',
          color: 'var(--text, #1f2937)',
          font: { family: 'Inter, sans-serif', size: 12, weight: '600' },
        },
        ticks: {
          color: 'var(--text, #1f2937)',
          font: { family: 'Inter, sans-serif', size: 12 },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { display: false },
      },
    },
  };

  if (loading) return <div className={styles.loadingSection}>Loading...</div>;
  if (error) return (
    <section className={styles.errorSection} role="alert">
      <p className={styles.errorText}>{error}</p>
    </section>
  );

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
          <Link 
            href="/cases/new" 
            className={styles.ctaButtonSecondary}
            onClick={() => trackClick('contribute_case_button', 'stats_empty')}
          >
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

  // Track page view on component mount
  useEffect(() => {
    trackPageView('Homepage', window.location.href);
    trackEngagement('page_load', 'homepage');
  }, []);

  // Track user authentication status
  useEffect(() => {
    if (user) {
      trackEvent('user_status', 'authentication', 'logged_in');
    } else {
      trackEvent('user_status', 'authentication', 'anonymous');
    }
  }, [user]);

  // Track cases loading
  useEffect(() => {
    if (!loading) {
      if (error) {
        trackEngagement('data_load_error', 'cases', error);
      } else {
        trackEngagement('data_load_success', 'cases', `${cases.length}_total_cases`);
      }
    }
  }, [loading, error, cases]);

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
      const selectedCase = cases[randomIndex];
      setCaseOfTheDay(selectedCase);
      
      // Track case of the day selection
      trackEngagement('case_of_day_selected', 'featured', selectedCase.id);
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
      const selectedSpecialty = specialties[weekNumber % specialties.length];
      setFeaturedSpecialty(selectedSpecialty);
      
      // Track featured specialty selection
      trackEngagement('specialty_featured', 'specialty_spotlight', selectedSpecialty);
    }
  }, [cases]);

  const recentCases = useMemo(() => {
    const recent = cases
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    // Track recent cases count
    if (recent.length > 0) {
      trackEvent('content_loaded', 'recent_cases', 'count', recent.length);
    }
    
    return recent;
  }, [cases]);

  const trendingCases = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const trending = cases
      .filter((caseData) => new Date(caseData.createdAt) >= oneWeekAgo)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 3);
    
    // Track trending cases
    if (trending.length > 0) {
      trackEvent('content_loaded', 'trending_cases', 'count', trending.length);
      const totalViews = trending.reduce((sum, c) => sum + (c.views || 0), 0);
      trackEvent('content_loaded', 'trending_cases', 'total_views', totalViews);
    }
    
    return trending;
  }, [cases]);

  const specialtyCases = useMemo(() => {
    const filtered = cases
      .filter((caseData) => Array.isArray(caseData.specialty) && caseData.specialty.includes(featuredSpecialty))
      .slice(0, 3);
    
    // Track specialty cases count
    if (filtered.length > 0 && featuredSpecialty) {
      trackEvent('content_loaded', 'specialty_cases', featuredSpecialty, filtered.length);
    }
    
    return filtered;
  }, [cases, featuredSpecialty]);

  // Track scroll depth
  useEffect(() => {
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track scroll milestones
        if (scrollPercent >= 25 && maxScroll < 25) {
          trackEngagement('scroll_depth', 'homepage', '25_percent');
        } else if (scrollPercent >= 50 && maxScroll < 50) {
          trackEngagement('scroll_depth', 'homepage', '50_percent');
        } else if (scrollPercent >= 75 && maxScroll < 75) {
          trackEngagement('scroll_depth', 'homepage', '75_percent');
        } else if (scrollPercent >= 90 && maxScroll < 90) {
          trackEngagement('scroll_depth', 'homepage', '90_percent');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();
    
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent('timing', 'homepage', 'time_on_page', timeSpent);
    };

    // Track time on page before user leaves
    window.addEventListener('beforeunload', trackTimeOnPage);
    
    // Also track at regular intervals for active users
    const interval = setInterval(() => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 0 && timeSpent % 30 === 0) { // Every 30 seconds
        trackEvent('timing', 'homepage', 'active_time', timeSpent);
      }
    }, 30000);

    return () => {
      window.removeEventListener('beforeunload', trackTimeOnPage);
      clearInterval(interval);
      trackTimeOnPage();
    };
  }, []);

  if (loading) return (
    <main className={styles.container}>
      <HeroSection />
      <section className={styles.loadingSection}>
        <Loading />
      </section>
    </main>
  );

  if (error) return (
    <main className={styles.container}>
      <HeroSection />
      <section className={styles.errorSection} role="alert">
        <p className={styles.errorText}>Error: {error}</p>
      </section>
    </main>
  );

  return (
    <main className={styles.container}>
      <GoogleAnalytics gaId="G-GLWW8HX76X" />
      <HeroSection />
      {cases.length === 0 ? (
        <section className={styles.emptySection} aria-live="polite">
          <p className={styles.emptyText}>No cases available yet. Be the first to share a case!</p>
          <Link 
            href="/cases/new" 
            className={styles.ctaButtonSecondary}
            onClick={() => trackClick('share_case_button', 'empty_state')}
          >
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
        </>
      )}
    </main>
  );
}