// components/Case/CaseCard.jsx
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../styles/caseCard.module.css';

export default function CaseCard({ caseData }) {
  const defaultImage = '/placeholder-case-image.jpg'; // Fallback image if none provided

  return (
    <Link href={`/cases/${caseData.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={caseData.mediaUrls?.[0] || defaultImage}
          alt={caseData.title}
          width={200}
          height={150}
          className={styles.image}
          objectFit="cover"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{caseData.title}</h3>
        <p className={styles.concern}>
          <strong>Chief Concern:</strong> {caseData.presentingComplaint || 'Not specified'}
        </p>
        <p className={styles.contributor}>
          <strong>By:</strong> {caseData.userName || 'Anonymous'}
        </p>
      </div>
    </Link>
  );
}