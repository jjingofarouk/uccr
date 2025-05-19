import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from '../../styles/caseCard.module.css';

export default function CaseCard({ caseData }) {
  const [userPhoto, setUserPhoto] = useState(null);

  useEffect(() => {
    const fetchUserPhoto = async () => {
      if (caseData.userId) {
        try {
          const profileDoc = await getDoc(doc(db, 'profiles', caseData.userId));
          if (profileDoc.exists()) {
            const data = profileDoc.data();
            setUserPhoto(data.photoURL || '/images/doctor-avatar.jpeg');
            console.log('CaseCard fetched photoURL:', data.photoURL); // Debug
          } else {
            setUserPhoto('/images/doctor-avatar.jpeg');
            console.log('CaseCard: No profile found for userId:', caseData.userId);
          }
        } catch (error) {
          console.error('CaseCard fetch error:', error);
          setUserPhoto('/images/doctor-avatar.jpeg');
        }
      } else {
        setUserPhoto('/images/doctor-avatar.jpeg');
        console.log('CaseCard: No userId in caseData');
      }
    };
    fetchUserPhoto();
  }, [caseData.userId]);

  console.log('CaseCard caseData:', caseData);

  return (
    <Link href={`/cases/${caseData.id}`} className={styles.card}>
      {Array.isArray(caseData.mediaUrls) && caseData.mediaUrls.length > 0 && caseData.mediaUrls[0] ? (
        <div className={styles.imageContainer}>
          <Image
            src={caseData.mediaUrls[0]}
            alt={caseData.title || 'Case image'}
            width={280}
            height={180}
            className={styles.image}
            objectFit="cover"
            onError={(e) => console.error('Case image error:', caseData.mediaUrls[0])}
          />
        </div>
      ) : (
        <div className={styles.imageContainer}>
          <Image
            src="/images/placeholder-case.jpg"
            alt="No case image"
            width={280}
            height={180}
            className={styles.image}
            objectFit="cover"
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
            src={userPhoto}
            alt={caseData.userName || 'Contributor'}
            width={24}
            height={24}
            className={styles.contributorAvatar}
            onError={(e) => console.error('Contributor image error:', userPhoto)}
          />
          <span>{caseData.userName || 'Anonymous'}</span>
        </div>
      </div>
    </Link>
  );
}