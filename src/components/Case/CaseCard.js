// src/components/Case/CaseCard.js
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../styles/caseCard.module.css';

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
      aria-label={`View case: ${caseData.title || 'Untitled Case'}`}
      role="article"
    >
      {hasImage && (
        <div className={styles.imageContainer}>
          <Image
            src={caseData.mediaUrls[0]}
            alt={`Image for ${caseData.title || 'case'}`}
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
        <h3 className={styles.title}>{caseData.title || 'Untitled Case'}</h3>
        <p className={styles.concern}>
          <strong>Chief Concern:</strong> {caseData.presentingComplaint || 'Not specified'}
        </p>
        <div className={styles.contributor}>
          <Image
            src={caseData.photoURL || '/images/doctor-avatar.jpeg'}
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