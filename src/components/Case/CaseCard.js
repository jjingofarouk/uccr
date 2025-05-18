import Link from 'next/link';
import styles from '../../styles/caseCard.module.css';

export default function CaseCard({ caseData }) {
  return (
    <div className={styles.card}>
      <h2>{caseData.title}</h2>
      <p><strong>Complaint:</strong> {caseData.presentingComplaint}</p>
      <p><strong>Posted by:</strong> {caseData.userName || 'Anonymous'}</p>
      <Link href={`/cases/${caseData.id}`} className={styles.link}>
        View Details
      </Link>
    </div>
  );
}