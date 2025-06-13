import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { addReaction } from '../../firebase/firestore';
import { Award } from 'lucide-react';
import CommentSection from './CommentSection';
import sanitizeHtml from 'sanitize-html';
import styles from '../../styles/caseDetail.module.css';

// Google Analytics tracking functions
const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

const trackPageView = (caseId, title) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-GLWW8HX76X', {
      page_title: `Case: ${title}`,
      page_location: window.location.href,
      custom_map: {
        case_id: caseId,
      },
    });
    
    // Track case view event
    trackEvent('view_case', 'Case', caseId, 1);
  }
};

// Utility function to sanitize and render HTML content
const renderRichText = (html) => {
  if (!html || typeof html !== 'string') return <p>Not specified</p>;
  const sanitizedHtml = sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'a', 'h1', 'h2'],
    allowedAttributes: {
      a: ['href', 'target'],
    },
  });
  return <div className={styles.richText} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default function CaseDetail({ caseData }) {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  // Track page view when component mounts
  useEffect(() => {
    if (caseData && caseData.id) {
      trackPageView(caseData.id, caseData.title || 'Untitled Case');
    }
  }, [caseData]);

  const handleVote = async (type) => {
    if (!user) {
      setError('You must be logged in to vote.');
      return;
    }
    try {
      await addReaction(caseData.id, user.uid, type);
      setError('');
      
      // Track vote event
      trackEvent('vote', 'Case Interaction', `${type}_${caseData.id}`, 1);
    } catch (err) {
      setError('Failed to record vote. Please try again.');
      
      // Track error event
      trackEvent('vote_error', 'Case Interaction', `${type}_${caseData.id}`, 1);
    }
  };

  const handleEditClick = () => {
    router.push(`/cases/edit/${caseData.id}`);
    
    // Track edit event
    trackEvent('edit_case', 'Case Management', caseData.id, 1);
  };

  const handleAuthorClick = (userId) => {
    // Track author profile view
    trackEvent('view_author', 'Profile', userId, 1);
  };

  const handleMediaView = (mediaIndex) => {
    // Track media view
    trackEvent('view_media', 'Case Media', `${caseData.id}_media_${mediaIndex}`, 1);
  };

  return (
    <article className={styles.caseDetail}>
      <header className={styles.header}>
        <h1 className={styles.title}>{renderRichText(caseData.title)}</h1>
        {user && user.uid === caseData.userId && (
          <button
            onClick={handleEditClick}
            className={styles.editButton}
            aria-label="Edit case"
          >
            Edit Case
          </button>
        )}
        <div className={styles.meta}>
          <div className={styles.author}>
            <Link href={`/profile/view/${caseData.userId}`} onClick={() => handleAuthorClick(caseData.userId)}>
              <Image
                src={caseData.photoURL || '/images/doctor-placeholder.jpg'}
                alt={caseData.userName || 'Contributor'}
                width={40}
                height={40}
                className={styles.avatar}
                onError={(e) => console.error('Author image error:', caseData.photoURL)}
              />
            </Link>
            <Link href={`/profile/view/${caseData.userId}`} onClick={() => handleAuthorClick(caseData.userId)}>
              <span className={styles.authorName}>{caseData.userName || 'Anonymous'}</span>
            </Link>
          </div>
          <time className={styles.date}>
            {caseData.createdAt
              ? new Date(caseData.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Unknown date'}
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
          {renderRichText(caseData.presentingComplaint)}
        </div>
        <div className={styles.section}>
          <h2>Specialties</h2>
          <p>{Array.isArray(caseData.specialty) && caseData.specialty.length > 0 ? caseData.specialty.join(', ') : 'Not specified'}</p>
        </div>
        <div className={styles.section}>
          <h2>History</h2>
          {renderRichText(caseData.history)}
        </div>
        <div className={styles.section}>
          <h2>Investigations</h2>
          {renderRichText(caseData.investigations)}
        </div>
        <div className={styles.section}>
          <h2>Management</h2>
          {renderRichText(caseData.management)}
        </div>
        <div className={styles.section}>
          <h2>Provisional Diagnosis</h2>
          {renderRichText(caseData.provisionalDiagnosis)}
        </div>
        <div className={styles.section}>
          <h2>Hospital</h2>
          {renderRichText(caseData.hospital)}
        </div>
        <div className={styles.section}>
          <h2>Referral Center</h2>
          {renderRichText(caseData.referralCenter)}
        </div>
        <div className={styles.section}>
          <h2>Discussion</h2>
          {renderRichText(caseData.discussion)}
        </div>
        <div className={styles.section}>
          <h2>High-Level Summary</h2>
          {renderRichText(caseData.highLevelSummary)}
        </div>
        <div className={styles.section}>
          <h2>References</h2>
          {renderRichText(caseData.references)}
        </div>
      </section>

      {Array.isArray(caseData.mediaUrls) && caseData.mediaUrls.length > 0 ? (
        <section className={styles.media}>
          <h2>Media</h2>
          <div className={styles.mediaGrid}>
            {caseData.mediaUrls.map((url, index) => (
              url ? (
                <Image
                  key={url}
                  src={url}
                  alt={`Case media ${index + 1}`}
                  width={600}
                  height={400}
                  className={styles.mediaImage}
                  objectFit="contain"
                  onClick={() => handleMediaView(index)}
                  style={{ cursor: 'pointer' }}
                  onError={(e) => console.error('Media image error:', url)}
                />
              ) : (
                <div key={index} className={styles.mediaImage}>
                  <Image
                    src="/images/default-placeholder.jpg"
                    alt="No media available"
                    width={600}
                    height={400}
                    objectFit="contain"
                  />
                </div>
              )
            ))}
          </div>
        </section>
      ) : (
        <section className={styles.media}>
          <h2>Media</h2>
          <p>No media available.</p>
        </section>
      )}

      <CommentSection caseId={caseData.id} />
    </article>
  );
}