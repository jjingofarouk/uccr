import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getTopContributors } from '../../firebase/firestore';
import { trackClick, trackEngagement } from '../../utils/analytics';
import styles from './LeaderBoard.module.css';

const LeaderboardSection = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        trackEngagement('load_start', 'leaderboard');
        const data = await getTopContributors(5); // Changed to 5 contributors
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

  const getRankDisplay = (index) => {
    switch (index) {
      case 0: return '1';
      case 1: return '2';
      case 2: return '3';
      case 3: return '4';
      case 4: return '5';
      default: return index + 1;
    }
  };

  const getRankSuffix = (index) => {
    switch (index) {
      case 0: return 'st';
      case 1: return 'nd';
      case 2: return 'rd';
      default: return 'th';
    }
  };

  if (loading) return (
    <SkeletonTheme baseColor="var(--border)" highlightColor="var(--secondary)">
      <section className={styles.leaderboardSection}>
        <Skeleton height={40} width={250} style={{ marginBottom: '2.5rem' }} />
        <div className={styles.leaderboard}>
          {[...Array(5)].map((_, index) => (
            <div key={index} className={styles.contributor}>
              <Skeleton circle width={60} height={60} />
              <div className={styles.contributorInfo}>
                <Skeleton width={120} height={20} style={{ marginBottom: '0.5rem' }} />
                <Skeleton width={100} height={15} />
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
      <h2 id="leaderboard-title" className={styles.sectionTitle}>
        Top Contributors
      </h2>
      
      {contributors.length > 0 ? (
        <div className={styles.leaderboard}>
          {contributors.map((contributor, index) => (
            <Link
              key={contributor.uid}
              href={`/profile/view/${contributor.uid}`}
              className={styles.contributor}
              onClick={() => trackClick('contributor_profile', 'leaderboard', `${contributor.displayName}_position_${index + 1}`)}
              title={`View ${contributor.displayName}'s profile - ${getRankDisplay(index)}${getRankSuffix(index)} place`}
            >
              <div className={styles.rankBadge}>
                {getRankDisplay(index)}
              </div>
              
              <Image
                src={contributor.photoURL}
                alt={`${contributor.displayName}'s avatar`}
                width={60}
                height={60}
                className={styles.contributorAvatar}
                priority={index < 3}
              />
              
              <div className={styles.contributorInfo}>
                <h3 className={styles.contributorName}>
                  {contributor.displayName}
                </h3>
                
                <div className={styles.contributorStats}>
                  <div>
                    {contributor.caseCount} case{contributor.caseCount !== 1 ? 's' : ''} uploaded
                  </div>
                  
                  {contributor.awards?.length > 0 && (
                    <div className={styles.awards}>
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
                          title={`${award} award recipient`}
                        >
                          {award} <Star size={10} />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.emptySection} aria-live="polite">
          <p className={styles.emptyText}>
            No contributors found yet
          </p>
          <Link
            href="/cases/new"
            className={styles.ctaButtonSecondary}
            onClick={() => trackClick('contribute_case_button', 'leaderboard_empty')}
          >
            Be the First Contributor
          </Link>
        </div>
      )}
    </section>
  );
};

export default LeaderboardSection;