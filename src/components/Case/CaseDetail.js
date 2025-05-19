
// components/Case/CaseDetail.jsx
import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../../hooks/useAuth';
import { addReaction } from '../../firebase/firestore';
import { Award } from 'lucide-react';
import CommentSection from './CommentSection';
import styles from '../../styles/caseDetail.module.css';

export default function CaseDetail({ caseData }) {
  const { user } = useAuth();
  const [error, setError] = useState('');

  const handleVote = async (type) => {
    if (!user) {
      setError('You must be logged in to vote.');
      return;
    }
    try {
      await addReaction(caseData.id, user.uid, type);
      setError('');
    } catch (err) {
      setError('Failed to record vote. Please try again.');
    }
  };

  return (
    <article className={styles.caseDetail}>
      <header className={styles.header}>
        <h1 className={styles.title}>{caseData.title || 'Untitled Case'}</h1>
        <div className={styles.meta}>
          <div className={styles.author}>
            <Image
              src={caseData.userPhoto || '/images/doctor-avatar.jpeg'}
              alt={caseData.userName || 'Contributor'}
              width={40}
              height={40}
              className={styles.avatar}
            />
            <span className={styles.authorName}>{caseData.userName || 'Anonymous'}</span>
          </div>
          <time className={styles.date}>
            {new Date(caseData.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>

      <div className={styles.voteSection}>
        <button
          onClick={() => handleVote('award')}
          className={styles.voteButton}
          disabled={!user}
          aria-label="Award case"
        >
          <Award size={20} />
          <span className={styles.voteCount}>{caseData.awards || 0}</span>
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>

      <section className={styles.content}>
        <div className={styles.section}>
          <h2>Chief Concern</h2>
          <p>{caseData.presentingComplaint || 'Not specified'}</p>
        </div>
        <div className={styles.section}>
          <h2>Specialty</h2>
          <p>{caseData.specialty || 'Not specified'}</p>
        </div>
        <div className={styles.section}>
          <h2>History</h2>
          <p>{caseData.history || 'Not provided'}</p>
        </div>
        <div className={styles.section}>
          <h2>Investigations</h2>
          <p>{caseData.investigations || 'Not provided'}</p>
        </div>
        <div className={styles.section}>
          <h2>Management</h2>
          <p>{caseData.management || 'Not provided'}</p>
        </div>
        <div className={styles.section}>
          <h2>Provisional Diagnosis</h2>
          <p>{caseData.provisionalDiagnosis || 'Not specified'}</p>
        </div>
        <div className={styles.section}>
          <h2>Hospital</h2>
          <p>{caseData.hospital || 'Not specified'}</p>
        </div>
        <div className={styles.section}>
          <h2>Referral Center</h2>
          <p>{caseData.referralCenter || 'Not specified'}</p>
        </div>
        <div className={styles.section}>
          <h2>Discussion</h2>
          <p>{caseData.discussion || 'Not provided'}</p>
        </div>
      </section>

      {caseData.mediaUrls?.length > 0 && (
        <section className={styles.media}>
          <h2>Media</h2>
          <div className={styles.mediaGrid}>
            {caseData.mediaUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Case media ${index + 1}`}
                width={600}
                height={400}
                className={styles.mediaImage}
                objectFit="contain"
              />
            ))}
          </div>
        </section>
      )}

      <CommentSection caseId={caseData.id} />
    </article>
  );
}
