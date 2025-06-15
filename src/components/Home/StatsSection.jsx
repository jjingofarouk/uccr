import { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getCaseStatistics } from '../../firebase/firestore';
import { trackEngagement, trackEvent } from '../../utils/analytics';
import Link from 'next/link';
import styles from './StatsSection.module.css';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StatsSection = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        trackEngagement('load_start', 'stats');
        const data = await getCaseStatistics();
        setStats(data.slice(0, 5));
        trackEngagement('load_success', 'stats', `${data.length}_specialties`);
        data.slice(0, 5).forEach((stat, index) => {
          trackEvent('specialty_title', 'stats', `${stat.specialty}_rank_${index + 1}`, stat.count);
        });
      } catch (err) {
        setError('Unable to load case statistics');
        trackEngagement('load_error', 'stats', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const barColors = [
    'rgba(59, 130, 246, 0.6)', // Blue
    'rgba(239, 68, 68, 0.6)', // Red
    'rgba(34, 197, 94, 0.6)', // Green
    'rgba(249, 115, 22, 0.6)', // Orange
    'rgba(168, 85, 247, 0.6)', // Purple
  ];

  // Memoize chart data to optimize performance
  const chartData = useMemo(() => ({
    labels: stats.map(s => s.specialty.length > 15 ? `${s.specialty.substring(0, 12)}...` : s.specialty),
    datasets: [{
      label: 'Number of Cases',
      data: stats.map(s => s.count),
      backgroundColor: stats.map((_, i) => {
        const ctx = document.createElement('canvas').getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 350);
        gradient.addColorStop(0, barColors[i % barColors.length].replace('0.6', '0.8'));
        gradient.addColorStop(1, barColors[i % barColors.length].replace('0.6', '0.2'));
        return gradient;
      }),
      borderColor: barColors.map(c => c.replace('0.6', '1')),
      borderWidth: 1,
      hoverBackgroundColor: barColors.map(c => c.replace('0.6', '0.8')),
    }],
  }), [stats]);

  const chartOptions = {
    animation: {
      duration: 1500,
      easing: 'easeOutBounce',
      onComplete: () => trackEngagement('animation_complete', 'stats'),
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { family: 'Inter, sans-serif', size: 12 },
        bodyFont: { family: 'Inter, sans-serif', size: 12 },
        callbacks: {
          label: (context) => {
            trackEngagement('tooltip_view', 'stats', `${context.label}_${context.raw}_specialty`);
            return `${context.label}: ${context.raw} cases`;
          },
        },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Specialty',
          font: { family: 'Inter, sans-serif', size: 12, weight: '600' },
          color: 'var(--text, #1f2937)',
        },
        ticks: {
          font: { family: 'Inter, sans-serif', size: 12 },
          color: 'var(--text, #1f2937)',
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Cases',
          font: { family: 'Inter, sans-serif', size: 12, weight: '600' },
          color: 'var(--text, #1f2937)',
        },
        ticks: {
          font: { family: 'Inter, sans-serif', size: 12 },
          color: 'var(--text, #1f2937)',
          stepSize: 1,
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length) {
        const index = elements[0].index;
        const data = stats[index];
        trackEngagement('click', 'stats', `${data.specialty}_${data.count}_specialty`);
      }
    },
    onHover: (event, elements) => {
      if (elements.length) {
        const index = elements[0].index;
        const data = stats[index];
        trackEngagement('hover', 'stats', data.specialty);
      }
    },
    maintainAspectRatio: false,
  };

  if (loading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
        <section className={styles.statsSection}>
          <Skeleton height={30} width={200} />
          <div className={styles.statsContainer}>
            <div className={styles.chartWrapper}>
              <Skeleton height={350} />
            </div>
          </div>
        </section>
      </SkeletonTheme>
    );
  }

  if (error) {
    return (
      <section className={styles.errorSection} role="alert">
        <p className={styles.errorText}>{error}</p>
      </section>
    );
  }

  return (
    <section className={styles.statsSection} aria-labelledby="stats-title">
      <h2 id="stats-title" className={styles.sectionTitle}>
        Case Statistics
      </h2>
      {stats.length > 0 ? (
        <div className={styles.statsContainer}>
          <div className={styles.chartWrapper}>
            <Bar data={chartData} options={chartOptions} />
            <div className={styles.chartCaption}>
              Top Specialties by Case Count
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.emptySection} aria-live="polite">
          <p className={styles.emptyText}>No case statistics available</p>
          <Link
            href="/cases/new"
            className={styles.ctaButtonSecondary}
            onClick={() => trackEngagement('click', 'stats_empty', 'contribute_case')}
          >
            Contribute a Case
          </Link>
        </div>
      )}
    </section>
  );
};

export default StatsSection;