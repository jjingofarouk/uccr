import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './config';

// Cache for trending cases
let cache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches top trending cases based on trendingScore from Firestore.
 * Assumes cases have denormalized views, commentsCount, and trendingScore fields.
 * @param {number} [limitCount=3] - Number of cases to fetch.
 * @returns {Promise<Array>} Promise resolving to an array of trending cases.
 * @throws {Error} If fetching fails.
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
    // Calculate 7 days ago from June 14, 2025
    const sevenDaysAgo = new Date('2025-06-14T15:50:00+03:00'); // 3:50 PM EAT
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // June 7, 2025
    const q = query(
      casesRef,
      where('lastInteractionAt', '>=', sevenDaysAgo),
      orderBy('lastInteractionAt', 'desc'),
      orderBy('trendingScore', 'desc'),
      limit(limitCount)
    );
    const casesSnapshot = await getDocs(q);

    const cases = casesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Update cache
    cache = cases;
    cacheTimestamp = Date.now();

    return cases;
  } catch (error) {
    console.error('Error fetching trending cases:', error);
    throw new Error('Failed to fetch trending cases');
  }
};