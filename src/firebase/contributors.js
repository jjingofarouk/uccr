import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';

export const getTopContributors = async (limitCount = 3) => {
  try {
    const profilesRef = collection(db, 'profiles');
    const profilesSnapshot = await getDocs(profilesRef);
    const contributors = [];

    for (const profileDoc of profilesSnapshot.docs) {
      const profileData = profileDoc.data();
      const casesRef = collection(db, 'cases');
      const userCasesQuery = query(casesRef, where('userId', '==', profileDoc.id));
      const casesSnapshot = await getDocs(userCasesQuery);
      const caseCount = casesSnapshot.size;
      
      let totalAwards = 0;
      casesSnapshot.forEach(doc => {
        const caseData = doc.data();
        totalAwards += Number(caseData.awards) || 0;
      });

      const awards = [];
      if (totalAwards >= 5) {
        awards.push('Gold');
      } else if (totalAwards >= 3) {
        awards.push('Silver');
      } else if (totalAwards >= 1) {
        awards.push('Bronze');
      }

      if (caseCount > 0) {
        contributors.push({
          uid: profileDoc.id,
          displayName: profileData.displayName || 'Anonymous',
          photoURL: profileData.photoURL || '/images/doctor-avatar.jpeg',
          caseCount,
          awards,
        });
      }
    }

    return contributors
      .sort((a, b) => b.caseCount - a.caseCount)
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching top contributors:', error);
    return [];
  }
};