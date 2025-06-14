import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getCaseStatistics } from '../../firebase/firestore';
import { trackEngagement, trackEvent } from '../../utils/analytics';
import styles from '../../pages/Home.module.css';

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

  const barColors = [
    'rgba(59, 130, 246, 0.6)',
    'rgba(239, 68, 68, 0.6)',
    'rgba(34, 197, 94, 0.6)',
    'rgba(249, 115, 22, 0.6)',
    'rgba(168, 85, 247, 0.6)',
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      trackEngagement('tooltip_view', 'stats', `${label}_${payload[0].value}_cases`);
      return (
        <div style={{
          backgroundColor: 'var(--tooltip-background, rgba(0, 0, 0, 0.8))',
          border: '1px solid var(--border, #e5e7eb)',
          padding: '8px',
          borderRadius: '4px'
        }}>
          <p style={{
            color: 'var(--tooltip-text, #ffffff)',
            margin: 0,
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px'
          }}>{`${label}: ${payload[0].value} cases`}</p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data, index) => {
    if (data) {
      trackEngagement('chart_click', 'stats', `${data.specialty}_${data.count}_cases`);
    }
  };

  const handleMouseEnter = (data, index) => {
    if (data) {
      trackEngagement('chart_hover', 'stats', data.specialty);
    }
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stats}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <XAxis
                  dataKey="specialty"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={60}
                  tick={{ fill: 'var(--text, #1f2937)', fontFamily: 'Inter, sans-serif', fontSize: 12 }}
                  label={{
                    value: 'Specialty',
                    position: 'bottom',
                    fill: 'var(--text, #1f2937)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12,
                    fontWeight: 600
                  }}
                />
                <YAxis
                  dataKey="count"
                  allowDecimals={false}
                  tick={{ fill: 'var(--text, #1f2937)', fontFamily: 'Inter, sans-serif', fontSize: 12 }}
                  label={{
                    value: 'Number of Cases',
                    angle: -90,
                    position: 'insideLeft',
                    fill: 'var(--text, #1f2937)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12,
                    fontWeight: 600
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  name="Number of Cases"
                  onClick={handleBarClick}
                  onMouseEnter={handleMouseEnter}
                >
                  {stats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={barColors[index % barColors.length]}
                      fillOpacity={0.6}
                      stroke={barColors[index % barColors.length].replace('0.6', '1')}
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{
              textAlign: 'center',
              marginTop: '8px',
              color: 'var(--text, #1f2937)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              fontWeight: 600
            }}>
              Top 5 Specialties by Case Count
            </div>
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