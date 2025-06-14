import { collection, collectionGroup, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './config';

export const getUserStats = async (uid) => {
  try {
    const casesQuery = query(collection(db, 'cases'), where('userId', '==', uid));
    const casesSnapshot = await getDocs(casesQuery, { source: 'server' });
    const caseCount = casesSnapshot.size;

    const commentsQuery = query(collectionGroup(db, 'comments'), where('userId', '==', uid));
    const commentsSnapshot = await getDocs(commentsQuery, { source: 'server' });
    const commentCount = commentsSnapshot.size;
    let reactionCount = 0;
    commentsSnapshot.forEach(doc => {
      const comment = doc.data();
      reactionCount += (Number(comment.upvotes) || 0) + (Number(comment.downvotes) || 0);
    });

    console.log('Fetched user stats for uid:', uid, { cases: caseCount, comments: commentCount, reactions: reactionCount });
    return {
      cases: caseCount,
      comments: commentCount,
      reactions: reactionCount,
    };
  } catch (error) {
    console.error('Get user stats error:', error.code, error.message);
    return { cases: 0, comments: 0, reactions: 0 };
  }
};

export const subscribeUserStats = (uid, callback) => {
  try {
    const casesQuery = query(collection(db, 'cases'), where('userId', '==', uid));
    const commentsQuery = query(collectionGroup(db, 'comments'), where('userId', '==', uid));

    const unsubscribeCases = onSnapshot(casesQuery, (casesSnapshot) => {
      const caseCount = casesSnapshot.size;
      let reactionCount = 0;

      const unsubscribeComments = onSnapshot(commentsQuery, (commentsSnapshot) => {
        const commentCount = commentsSnapshot.size;
        commentsSnapshot.forEach(doc => {
          const comment = doc.data();
          reactionCount += (Number(comment.upvotes) || 0) + (Number(comment.downvotes) || 0);
        });

        const stats = {
          cases: caseCount,
          comments: commentCount,
          reactions: reactionCount,
        };
        console.log('Real-time stats for uid:', uid, stats);
        callback(stats);
      }, (error) => {
        console.error('Comments subscription error:', error.code, error.message);
        callback({ cases: caseCount, comments: 0, reactions: 0 });
      });

      return () => unsubscribeComments();
    }, (error) => {
      console.error('Cases subscription error:', error.code, error.message);
      callback({ cases: 0, comments: 0, reactions: 0 });
    });

    return () => unsubscribeCases();
  } catch (error) {
    console.error('Subscribe user stats error:', error.code, error.message);
    callback({ cases: 0, comments: 0, reactions: 0 });
    return () => {};
  }
};

export const getCaseStatistics = async () => {
  try {
    const casesRef = collection(db, 'cases');
    const snapshot = await getDocs(casesRef);
    const stats = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      const specialties = Array.isArray(data.specialty) ? data.specialty : typeof data.specialty === 'string' && data.specialty ? [data.specialty] : ['Unknown'];

      specialties.forEach((spec) => {
        if (spec && typeof spec === 'string') {
          // Split combined specialties (e.g., "Tropical Medicine and Infectious Diseases")
          const splitSpecialties = spec
            .split(/and|,|\s+/)
            .map((s) => s.trim())
            .filter((s) => s);
          
          splitSpecialties.forEach((splitSpec) => {
            stats[splitSpec] = (stats[splitSpec] || 0) + 1;
          });
        } else {
          // Handle cases with no valid specialty
          stats['Unknown'] = (stats['Unknown'] || 0) + 1;
        }
      });
    });

    const result = Object.entries(stats)
      .map(([specialty, count]) => ({
        specialty,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    console.log('Fetched case statistics:', result);
    return result;
  } catch (error) {
    console.error('Error fetching case statistics:', error);
    return [];
  }
};