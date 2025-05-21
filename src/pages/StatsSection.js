import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCaseStatistics } from '../firebase/firestore';
import Loading from '../components/Loading';
import styles from './Home.module.css';

export default function StatsSection() {
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
    <section className={styles.statsSection} aria-labelledby="stats-title">
      <h2 id="stats-title" className={styles.sectionTitle}>Case Statistics</h2>
      {stats.length > 0 ? (
        <div className={styles.statsContainer}>
          <table className={styles.statsTable}>
            <thead>
              <tr>
                <th>Specialty</th>
                <th>Number of Cases</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((item, index) => (
                <tr key={index}>
                  <td>{item.specialty}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
}