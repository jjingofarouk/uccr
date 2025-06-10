import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import Skeleton from 'react-loading-skeleton';
import { getCaseStatistics } from '../firebase/firestore';
import styles from '../pages/Home.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const StatsSection = () => {
  const { data: stats = [], isLoading, error } = useQuery({
    queryKey: ['caseStatistics'],
    queryFn: async () => {
      const data = await getCaseStatistics();
      return data.sort((a, b) => b.count - a.count).slice(0, 5);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 1,
  });

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
        hoverBackgroundColor: barColors.map((color) => color.replace('0.6', '0.8')),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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

  if (isLoading) {
    return (
      <section className={styles.statsSection} aria-labelledby="stats-title">
        <h2 id="stats-title" className={styles.sectionTitle}>Case Statistics</h2>
        <div className={styles.statsContainer}>
          <Skeleton height={300} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.errorSection} role="alert">
        <p className={styles.errorText}>Unable to load case statistics</p>
        <button onClick={() => window.location.reload()} className={styles.ctaButtonSecondary}>
          Retry
        </button>
      </section>
    );
  }

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

export default StatsSection;