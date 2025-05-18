import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { addReaction } from '../../firebase/firestore';
import CommentSection from './CommentSection';
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
      <h2>{caseData.title}</h2>
      <p><strong>Specialty:</strong> {caseData.specialty || 'Not specified'}</p>
      <p><strong>Presenting Complaint:</strong> {caseData.presentingComplaint}</p>
      <p><strong>Provisional Diagnosis:</strong> {caseData.provisionalDiagnosis || 'Not specified'}</p>
      <p><strong>History:</strong> {caseData.history || 'Not provided'}</p>
      <p><strong>Investigations:</strong> {caseData.investigations || 'Not provided'}</p>
      <p><strong>Management:</strong> {caseData.management || 'Not provided'}</p>
      <p><strong>Hospital:</strong> {caseData.hospital || 'Not specified'}</p>
      <p><strong>Referral Center:</strong> {caseData.referralCenter || 'Not specified'}</p>
      <p><strong>Discussion:</strong> {caseData.discussion || 'No discussion provided'}</p>
      <p><strong>Posted by:</strong> {caseData.userName || 'Anonymous'}</p>
      {caseData.mediaUrls && caseData.mediaUrls.length > 0 && (
        <div className={styles.media}>
          <h3>Images</h3>
          {caseData.mediaUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`${caseData.title} ${index + 1}`}
              className={styles.image}
            />
          ))}
        </div>
      )}
      <div className={styles.reactions}>
        <button
          onClick={() => handleReaction('Like')}
          disabled={reaction === 'Like'}
          className={reaction === 'Like' ? styles.active : ''}
        >
          Like
        </button>
        <button
          onClick={() => handleReaction('Insightful')}
          disabled={reaction === 'Insightful'}
          className={reaction === 'Insightful' ? styles.active : ''}
        >
          Insightful
        </button>
        <button
          onClick={() => handleReaction('Dislike')}
          disabled={reaction === 'Dislike'}
          className={reaction === 'Dislike' ? styles.active : ''}
        >
          Dislike
        </button>
      </div>
      <CommentSection caseId={caseData.id} />
    </div>
  );
}