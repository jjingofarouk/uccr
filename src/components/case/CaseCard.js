import Link from 'next/link';
import styles from '../../styles/globals.css';

export default function CaseCard({ caseData }) {
  return (
    <div className="case-card">
      <h3>{caseData.title}</h3>
      <p><strong>Complaint:</strong> {caseData.presentingComplaint}</p>
      <Link href={`/cases/${caseData.id}`}>View Details</Link>
    </div>
  );
}
