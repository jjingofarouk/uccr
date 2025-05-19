// components/Case/CaseDetail.jsx
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { addReaction } from '../../firebase/firestore';
import CommentSection from './CommentSection';
import Image from 'next/image';
import styles from '../../styles/caseDetail.module.css';

export default function CaseDetail({ caseData }) {
  const { user } = useAuth();
  const [reaction, setReaction] = useState(null);

  const handleReaction = async (type) => {
    if (!user) return;
    await addReaction(caseData.id, user.uid, type);
    setReaction(type);
  };

  return (
    <div className={styles.caseDetail}>
      <header className={styles.header}>
        <h1 className={styles.title}>{caseData.title}</h1>
        <p className={styles.meta}>
          Posted by <strong>{caseData.userName || 'Anonymous'}</strong> on{' '}
          {caseData.createdAt
            ? new Date(caseData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'Unknown date'}
          {caseData.updatedAt && caseData.updatedAt !== caseData.createdAt && (
            <span>
              {' • Updated on '}
              {new Date(caseData.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
        </p>
      </header>

      <section className={styles.overview}>
        <h2>Overview</h2>
        <div className={styles.detailGrid}>
          <p>
            <strong>Specialty:</strong> {caseData.specialty || 'Not specified'}
          </p>
          <p>
            <strong>Chief Concern:</strong> {caseData.presentingComplaint || 'Not specified'}
          </p>
          <p>
            <strong>Provisional Diagnosis:</strong> {caseData.provisionalDiagnosis || 'Not specified'}
          </p>
          <p>
            <strong>Hospital:</strong> {caseData.hospital || 'Not specified'}
          </p>
          <p>
            <strong>Referral Center:</strong> {caseData.referralCenter || 'Not specified'}
          </p>
        </div>
      </section>

      <section className={styles.clinical}>
        <h2>Clinical Details</h2>
        <div className={styles.detailSection}>
          <h3>History</h3>
          <p>{caseData.history || 'Not provided'}</p>
        </div>
        <div className={styles.detailSection}>
          <h3>Investigations</h3>
          <p>{caseData.investigations || 'Not provided'}</p>
        </div>
        <div className={styles.detailSection}>
          <h3>Management</h3>
          <p>{caseData.management || 'Not provided'}</p>
        </div>
        <div className={styles.detailSection}>
          <h3>Discussion</h3>
          <p>{caseData.discussion || 'No discussion provided'}</p>
        </div>
      </section>

      {caseData.mediaUrls && caseData.mediaUrls.length > 0 && (
        <section className={styles.media}>
          <h2>Media</h2>
          <div className={styles.mediaGrid}>
            {caseData.mediaUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`${caseData.title} ${index + 1}`}
                width={300}
                height={200}
                className={styles.image}
                objectFit="contain"
              />
            ))}
          </div>
        </section>
      )}

      <section className={styles.reactions}>
        <h2>Reactions</h2>
        <div className={styles.reactionButtons}>
          <button
            onClick={() => handleReaction('Like')}
            disabled={reaction === 'Like' || !user}
            className={`${styles.reactionButton} ${reaction === 'Like' ? styles.active : ''}`}
            aria-label="Like case"
          >
            Like
          </button>
          <button
            onClick={() => handleReaction('Insightful')}
            disabled={reaction === 'Insightful' || !user}
            className={`${styles.reactionButton} ${reaction === 'Insightful' ? styles.active : ''}`}
            aria-label="Mark as Insightful"
          >
            Insightful
          </button>
          <button
            onClick={() => handleReaction('Dislike')}
            disabled={reaction === 'Dislike' || !user}
            className={`${styles.reactionButton} ${reaction === 'Dislike' ? styles.active : ''}`}
            aria-label="Dislike case"
          >
            Dislike
          </button>
        </div>
      </section>

      <CommentSection caseId={caseData.id} />
    </div>
  );
}