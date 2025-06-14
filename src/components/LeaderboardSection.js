import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getTopContributors } from '../../firebase/firestore';
import { trackClick, trackEngagement } from '../../utils/analytics';
import styles from '../../pages/Home.module.css';

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

  if (loading) return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
      <section className={styles.leaderboardSection}>
        <Skeleton height={30} width={200} />
        <div className={styles.leaderboard}>
          {[...Array(3)].map((_, index) => (
            <div key={index} className={styles.contributor}>
              <Skeleton circle width={40} height={40} />
              <div>
                <Skeleton width={100} height={20} />
                <Skeleton width={80} height={15} />
              </div>
            </div>
          ))}
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

export default LeaderboardSection;