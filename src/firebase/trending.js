import { collection, getDocs } from 'firebase/firestore';
import { db } from './config';
import { fetchUserPhotoURL } from './utils';

// Cache for random cases
let cache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches random cases from Firestore to simulate trending cases.
 * @param {number} [limitCount=3] - Number of cases to fetch.
 * @returns {Promise<Array>} Array of random cases.
 */
export const getTrendingCases = async (limitCount = 3) => {
  try {
    // Validate limitCount
    if (typeof limitCount !== 'number' || limitCount < 1 || limitCount > 50) {
      limitCount = 3;
    }

    // Check cache
    if (cache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return cache.slice(0, limitCount);
    }

    const casesRef = collection(db, 'cases');
    const snapshot = await getDocs(casesRef);
    
    // Convert snapshot to array with photoURL and date conversion
    const allCasesPromises = snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const photoURL = data.userId ? await fetchUserPhotoURL(data.userId) : '/images/doctor-avatar.jpeg';
      return {
        id: doc.id,
        userId: data.userId,
        userName: data.userName || 'Anonymous',
        title: data.title || '',
        specialty: Array.isArray(data.specialty) ? data.specialty : (data.specialty ? [data.specialty] : []),
        presentingComplaint: data.presentingComplaint || '',
        history: data.history || '',
        physicalExam: data.physicalExam || '',
        investigations: data.investigations || '',
        provisionalDiagnosis: data.provisionalDiagnosis || '',
        management: data.management || '',
        discussion: data.discussion || '',
        highLevelSummary: data.highLevelSummary || '',
        references: data.references || '',
        hospital: data.hospital || '',
        referralCenter: data.referralCenter || '',
        mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
        awards: Number(data.awards) || 0,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        photoURL,
      };
    });
    
    const allCases = await Promise.all(allCasesPromises);
    
    // Shuffle array using Fisher-Yates algorithm
    for (let i = allCases.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCases[i], allCases[j]] = [allCases[j], allCases[i]];
    }

    // Take requested number of cases
    const randomCases = allCases.slice(0, limitCount);

    // Update cache
    cache = randomCases;
    cacheTimestamp = Date.now();

    return randomCases;
  } catch (error) {
    console.error('Error fetching random cases:', error);
    return [];
  }
};