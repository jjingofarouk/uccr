// components/Case/CaseCard.jsx
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../styles/caseCard.module.css';

export default function CaseCard({ caseData }) {
  console.log('CaseCard mediaUrls:', caseData.mediaUrls);

  return (
    <Link href={`/cases/${caseData.id}`} className={styles.card}>
      {Array.isArray(caseData.mediaUrls) && caseData.mediaUrls.length > 0 ? (
        <div className={styles.imageContainer}>
          <Image
            src={caseData.mediaUrls[0]}
            alt={caseData.title || 'Case image'}
            width={280}
            height={180}
            className={styles.image}
            objectFit="cover"
            onError={(e) => console.error('Case image error:', caseData.mediaUrls[0])}
            unoptimized // Bypass Next.js optimization for testing
          />
        </div>
      ) : (
        <div className={styles.imageContainer}>
          <p>No image available</p>
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{caseData.title || 'Untitled Case'}</h3>
        <p className={styles.concern}>
          <strong>Chief Concern:</strong> {caseData.presentingComplaint || 'Not specified'}
        </p>
        <div className={styles.contributor}>
          <Image
            src={caseData.userPhoto || '/images/doctor-avatar.jpeg'}
            alt={caseData.userName || 'Contributor'}
            width={24}
            height={24}
            className={styles.contributorAvatar}
            onError={(e) => console.error('Contributor image error:', caseData.userPhoto)}
            unoptimized
          />
          <span>{caseData.userName || 'Anonymous'}</span>
        </div>
      </div>
    </Link>
  );
}