import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { GoogleAnalytics } from '@next/third-parties/google';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useCases } from '../hooks/useCases';
import { useAuth } from '../hooks/useAuth';
import { trackPageView, trackEvent, trackEngagement } from '../utils/analytics';
import HeroSection from '../components/HeroSection';
import FeaturedSection from '../components/FeaturedSection';
import TrendingSection from '../components/TrendingSection';
import RecentSection from '../components/RecentSection';
import SpecialtySection from '../components/SpecialtySection';
import StatsSection from '../components/StatsSection';
import LeaderboardSection from '../components/LeaderboardSection';
import styles from './Home.module.css';

export default function HomePage() {
  const { user } = useAuth();
  const { cases, loading, error } = useCases();
  const [caseOfTheDay, setCaseOfTheDay] = useState(null);
  const [featuredSpecialty, setFeaturedSpecialty] = useState('');

  useEffect(() => {
    trackPageView('Homepage', window.location.href);
    trackEngagement('page_load', 'homepage');
  }, []);

  useEffect(() => {
    if (user) {
      trackEvent('user_status', 'authentication', 'logged_in');
    } else {
      trackEvent('user_status', 'authentication', 'anonymous');
    }
  }, [user]);

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
      trackEngagement('specialty_featured', 'specialty_spotlight', selectedSpecialty);
    }
  }, [cases]);

  const recentCases = useMemo(() => {
    const recent = cases
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
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
    if (filtered.length > 0 && featuredSpecialty) {
      trackEvent('content_loaded', 'specialty_cases', featuredSpecialty, filtered.length);
    }
    return filtered;
  }, [cases, featuredSpecialty]);

  useEffect(() => {
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
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

  useEffect(() => {
    const startTime = Date.now();
    
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent('timing', 'homepage', 'time_on_page', timeSpent);
    };

    window.addEventListener('beforeunload', trackTimeOnPage);
    const interval = setInterval(() => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 0 && timeSpent % 30 === 0) {
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
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
      <main className={styles.container}>
        <HeroSection />
        <section className={styles.loadingSection}>
          <Skeleton height={300} count={3} />
        </section>
      </main>
    </SkeletonTheme>
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