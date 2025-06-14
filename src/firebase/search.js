import { collection, getDocs } from 'firebase/firestore';
import { db } from './config';

export const searchCasesAndUsers = async (searchTerm) => {
  try {
    const term = searchTerm.toLowerCase().trim();
    const results = { cases: [], users: [] };

    const casesRef = collection(db, 'cases');
    const casesSnapshot = await getDocs(casesRef);
    const casePromises = casesSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const matches =
        (data.title?.toLowerCase().includes(term) ||
         data.specialty?.toLowerCase().includes(term) ||
         data.presentingComplaint?.toLowerCase().includes(term) ||
         data.highLevelSummary?.toLowerCase().includes(term));
      if (matches) {
        return {
          id: doc.id,
          title: data.title || 'Untitled Case',
          specialty: data.specialty || 'No specialty',
          userId: data.userId,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        };
      }
      return null;
    });
    results.cases = (await Promise.all(casePromises)).filter((c) => c !== null);

    const usersRef = collection(db, 'profiles');
    const usersSnapshot = await getDocs(usersRef);
    const userPromises = usersSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const matches =
        (data.displayName?.toLowerCase().includes(term) ||
         data.specialty?.toLowerCase().includes(term) ||
         data.email?.toLowerCase().includes(term));
      if (matches) {
        return {
          uid: doc.id,
          displayName: data.displayName || 'Anonymous',
          specialty: data.specialty || 'No specialty',
          photoURL: data.photoURL || '/images/doctor-avatar.jpeg',
        };
      }
      return null;
    });
    results.users = (await Promise.all(userPromises)).filter((u) => u !== null);

    console.log('Search term:', term, 'Results:', results);
    return results;
  } catch (error) {
    console.error('searchCasesAndUsers error:', error);
    throw new Error('Failed to search cases and users');
  }
};