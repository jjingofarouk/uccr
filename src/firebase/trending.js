import { collection, getDocs } from 'firebase/firestore';
import { db } from './config';

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
    
    // Convert snapshot to array and shuffle
    const allCases = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
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