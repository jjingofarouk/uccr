import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import { getTopContributors } from '../firebase/firestore';
import styles from '../pages/Home.module.css';

const LeaderboardSection = () => {
  const { data: contributors = [], isLoading, error } = useQuery({
    queryKey: ['topContributors'],
    queryFn: () => getTopContributors(3),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 1,
  });

  if (isLoading) {
    return (
      <section className={styles.leaderboardSection} aria-labelledby="leaderboard-title">
        <h2 id="leaderboard-title" className={styles.sectionTitle}>Top Contributors</h2>
        <div className={styles.leaderboard}>
          <Skeleton height={60} count={3} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.errorSection} role="alert">
        <p className={styles.errorText}>Failed to load top contributors</p>
        <button onClick={() => window.location.reload()} className={styles.ctaButtonSecondary}>
          Retry
        </button>
      </section>
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

export default LeaderboardSection;