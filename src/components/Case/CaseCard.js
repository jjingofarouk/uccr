import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Award, User } from 'lucide-react';
import styles from './CaseCard.module.css';

export default function CaseCard({ caseData }) {
  const renderSpecialtyTags = () => {
    const specialties = Array.isArray(caseData.specialty) 
      ? caseData.specialty 
      : (caseData.specialty && typeof caseData.specialty === 'string' 
          ? [caseData.specialty] 
          : []);
    
    if (specialties.length === 0) {
      return <span className={styles.tag}>Not specified</span>;
    }

    return specialties.map((specialty, index) => (
      <span key={index} className={styles.tag}>
        {specialty}
      </span>
    ));
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.specialtyTags}>
          {renderSpecialtyTags()}
        </div>
      </div>
      <Link href={`/cases/${caseData.id}`} className={styles.cardLink}>
        <div className={styles.cardContent}>
          <h3 className={styles.title}>
            {caseData.title || 'Untitled Case'}
          </h3>
          <p className={styles.complaint}>
            {caseData.presentingComplaint || 'No presenting complaint provided'}
          </p>
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <Calendar size={16} />
              <span>
                {caseData.createdAt instanceof Date
                  ? caseData.createdAt.toLocaleDateString()
                  : new Date(caseData.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.metaItem}>
              <Award size={16} />
              <span>{caseData.awards || 0} Awards</span>
            </div>
            <div className={styles.metaItem}>
              <User size={16} />
              <span>{caseData.userName || 'Anonymous'}</span>
            </div>
          </div>
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.author}>
            <Image
              src={caseData.photoURL || '/images/doctor-placeholder.jpg'}
              alt={`${caseData.userName || 'Author'}'s avatar`}
              width={32}
              height={32}
              className={styles.avatar}
            />
            <span>{caseData.userName || 'Anonymous'}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}