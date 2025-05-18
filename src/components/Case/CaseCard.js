import Link from 'next/link';
import styles from '../../styles/caseCard.module.css';

export default function CaseCard({ caseData }) {
  return (
    <div className={styles.card}>
      <h2>{caseData.title}</h2>
      <p><strong>Complaint:</strong> {caseData.presentingComplaint}</p>
      <p><strong>Posted by:</strong> {caseData.userName || 'Anonymous'}</p>
      {caseData.mediaUrls && caseData.mediaUrls.length > 0 && (
        <div className={styles.media}>
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
      <Link href={`/cases/${caseData.id}`} className={styles.link}>
        View Details
      </Link>
    </div>
  );
}