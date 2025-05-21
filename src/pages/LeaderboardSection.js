import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getTopContributors } from '../firebase/firestore';
import { Star } from 'lucide-react';
import Loading from '../components/Loading';
import styles from './Home.module.css';

export default function LeaderboardSection() {
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
}