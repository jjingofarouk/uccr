import Link from 'next/link';
import Image from 'next/image';
import sanitizeHtml from 'sanitize-html';
import styles from '../../styles/caseCard.module.css';

// Utility function to render and truncate rich text for summary
const renderRichTextSummary = (html) => {
  if (!html || typeof html !== 'string') return 'Not specified';
  const cleanText = sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  });
  return cleanText.length > 100 ? cleanText.slice(0, 100) + '...' : cleanText;
};

// Utility function to format posted date
const formatPostedDate = (createdAt) => {
  if (!createdAt) return 'Unknown date';
  const date = new Date(createdAt);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Utility function to render specialty tags
const renderSpecialtyTags = (specialties) => {
  if (!Array.isArray(specialties) || specialties.length === 0) {
    return <span className={styles.tag}>Not specified</span>;
  }
  const maxTags = 3;
  const visibleTags = specialties.slice(0, maxTags);
  const remainingCount = specialties.length - maxTags;

  return (
    <div className={styles.tags}>
      {visibleTags.map((specialty, index) => (
        <span key={index} className={styles.tag}>
          {specialty}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className={`${styles.tag} ${styles.moreTag}`}>
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

export default function CaseCard({ caseData }) {
  console.log(`CaseCard caseData (ID: ${caseData?.id || 'unknown'}):`, caseData);

  if (!caseData?.id) {
    return <div className={styles.error}>Error: Invalid case data</div>;
  }

  const hasImage = caseData.mediaUrls?.length > 0 && caseData.mediaUrls[0];

  return (
    <Link
      href={`/cases/${caseData.id}`}
      className={`${styles.card} ${hasImage ? '' : styles.noImageCard}`}
      aria-label={`View case: ${renderRichTextSummary(caseData.title) || 'Untitled Case'}`}
      role="article"
    >
      {hasImage && (
        <div className={styles.imageContainer}>
          <Image
            src={caseData.mediaUrls[0]}
            alt={`Image for ${renderRichTextSummary(caseData.title) || 'case'}`}
            width={280}
            height={180}
            className={styles.image}
            sizes="(max-width: 640px) 100vw, 280px"
            priority={false}
            onError={(e) => console.error(`Image error for case ${caseData.id}:`, caseData.mediaUrls[0])}
          />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{renderRichTextSummary(caseData.title) || 'Untitled Case'}</h3>
        <p className={styles.concern}>
          <strong>Chief Concern:</strong> {renderRichTextSummary(caseData.presentingComplaint)}
        </p>
        <div className={styles.specialty}>
          <strong>Specialties:</strong> {renderSpecialtyTags(caseData.specialty)}
        </div>
        <p className={styles.postedDate}>{formatPostedDate(caseData.createdAt)}</p>
        <div className={styles.contributor}>
          <Image
            src={caseData.photoURL || '/images/doctor-placeholder.jpg'}
            alt={`Avatar for ${caseData.userName || 'Contributor'}`}
            width={24}
            height={24}
            className={styles.contributorAvatar}
            onError={(e) => console.error(`Contributor image error for case ${caseData.id}:`, caseData.photoURL)}
          />
          <span>{caseData.userName || 'Anonymous'}</span>
        </div>
      </div>
    </Link>
  );
}