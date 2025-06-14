
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getCaseStatistics } from '../../firebase/firestore';
import { trackEngagement, trackEvent } from '../../utils/analytics';
import styles from '../../pages/Home.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

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

  if (loading) return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
      <section className={styles.statsSection}>
        <Skeleton height={30} width={200} />
        <div className={styles.statsContainer}>
          <div className={styles.chartWrapper}>
            <Skeleton height={300} />
          </div>
        </div>
      </section>
    </SkeletonTheme>
  );

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

export default StatsSection;