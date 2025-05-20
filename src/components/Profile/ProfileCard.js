import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { subscribeUserStats } from '../../firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/Loading';
import styles from './profileCard.module.css';

export default function ProfileCard({ userData }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    cases: 0,
    comments: 0,
    reactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userData?.uid) {
      setError('Invalid user data: No uid provided');
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeUserStats(userData.uid, (userStats) => {
      setStats({ ...userStats });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData?.uid]);

  if (loading) return <Loading />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.card}>
      <div className={styles.cardInner}>
        {/* Left Column - Avatar and Basic Info */}
        <div className={styles.cardSidebar}>
          <div className={styles.imageWrapper}>
            <Image
              src={userData.photoURL || '/images/doctor-avatar.jpeg'}
              alt="Profile"
              width={120}
              height={120}
              className={styles.profileImage}
              onError={(e) => { e.target.src = '/images/doctor-avatar.jpeg'; }}
            />
          </div>
          <h3 className={styles.name}>{userData.displayName || 'User'}</h3>
          {userData.role && (
            <p className={styles.role}>{userData.role}</p>
          )}
          <div className={styles.actions}>
            <Link href={`/profile/view/${userData.uid}`} className={styles.viewButton}>
              View Profile
            </Link>
            {user && user.uid === userData.uid && (
              <Link href="/profile/edit" className={styles.editButton}>
                Edit Profile
              </Link>
            )}
          </div>
        </div>

        {/* Right Column - Details & Stats */}
        <div className={styles.cardContent}>
          <div className={styles.infoSection}>
            <h4 className={styles.sectionTitle}>Personal Information</h4>
            <div className={styles.infoGrid}>
              {userData.displayName && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Name:</span>
                  <span className={styles.infoValue}>{userData.displayName}</span>
                </div>
              )}
              {userData.email && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>{userData.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.infoSection}>
            <h4 className={styles.sectionTitle}>Professional Information</h4>
            <div className={styles.infoGrid}>
              {userData.title && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Title:</span>
                  <span className={styles.infoValue}>{userData.title}</span>
                </div>
              )}
              {userData.specialty && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Specialty:</span>
                  <span className={styles.infoValue}>{userData.specialty}</span>
                </div>
              )}
              {userData.institution && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Institution:</span>
                  <span className={styles.infoValue}>{userData.institution}</span>
                </div>
              )}
              {userData.education && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Education:</span>
                  <span className={styles.infoValue}>{userData.education}</span>
                </div>
              )}
              {userData.levelOfStudy && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Level of Study:</span>
                  <span className={styles.infoValue}>{userData.levelOfStudy}</span>
                </div>
              )}
              {userData.courseOfStudy && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Course of Study:</span>
                  <span className={styles.infoValue}>{userData.courseOfStudy}</span>
                </div>
              )}
              {userData.yearsOfExperience && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Years of Experience:</span>
                  <span className={styles.infoValue}>{userData.yearsOfExperience}</span>
                </div>
              )}
            </div>
          </div>

          {userData.researchInterests?.length > 0 && (
            <div className={styles.infoSection}>
              <h4 className={styles.sectionTitle}>Research Interests</h4>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Interests:</span>
                  <span className={styles.infoValue}>
                    {userData.researchInterests.map((interest, index) => (
                      <span key={index}>
                        {interest.replace(/^Other:/, '')}
                        {index < userData.researchInterests.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          )}

          {userData.certifications?.length > 0 && (
            <div className={styles.infoSection}>
              <h4 className={styles.sectionTitle}>Certifications</h4>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Certifications:</span>
                  <span className={styles.infoValue}>
                    {userData.certifications.map((cert, index) => (
                      <span key={index}>
                        {cert.replace(/^Other:/, '')}
                        {index < userData.certifications.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          )}

          {userData.professionalAffiliations?.length > 0 && (
            <div className={styles.infoSection}>
              <h4 className={styles.sectionTitle}>Professional Affiliations</h4>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Affiliations:</span>
                  <span className={styles.infoValue}>
                    {userData.professionalAffiliations.map((aff, index) => (
                      <span key={index}>
                        {aff.replace(/^Other:/, '')}
                        {index < userData.professionalAffiliations.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          )}

          {(userData.linkedIn || userData.xProfile) && (
            <div className={styles.infoSection}>
              <h4 className={styles.sectionTitle}>Professional Links</h4>
              <div className={styles.infoGrid}>
                {userData.linkedIn && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>LinkedIn:</span>
                    <span className={styles.infoValue}>
                      <a href={userData.linkedIn} target="_blank" rel="noopener noreferrer">
                        {userData.linkedIn}
                      </a>
                    </span>
                  </div>
                )}
                {userData.xProfile && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>X Profile:</span>
                    <span className={styles.infoValue}>
                      <a href={userData.xProfile} target="_blank" rel="noopener noreferrer">
                        {userData.xProfile}
                      </a>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {userData.bio && (
            <div className={styles.bioSection}>
              <h4 className={styles.sectionTitle}>Bio</h4>
              <p className={styles.bio}>{userData.bio}</p>
            </div>
          )}

          <div className={styles.statsSection}>
            <h4 className={styles.sectionTitle}>Activity</h4>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.cases}</span>
                <span className={styles.statLabel}>Cases</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.comments}</span>
                <span className={styles.statLabel}>Comments</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.reactions}</span>
                <span className={styles.statLabel}>Reactions</span>
              </div>
            </div>
          </div>

          {userData.updatedAt && (
            <p className={styles.updatedAt}>
              Last Updated: {new Date(userData.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}