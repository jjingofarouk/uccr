import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';

export const searchCasesAndUsers = async (searchTerm) => {
  try {
    const term = searchTerm.toLowerCase().trim();
    if (term.length < 2) return { cases: [], users: [] };

    const results = { cases: [], users: [] };

    // Search cases
    const casesQuery = query(
      collection(db, 'cases'),
      where('searchKeywords', 'array-contains', term)
    );
    const casesSnapshot = await getDocs(casesQuery);
    results.cases = casesSnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title || 'Untitled Case',
      specialty: doc.data().specialty || 'No specialty',
      userId: doc.data().userId,
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));

    // Search users
    const usersQuery = query(
      collection(db, 'profiles'),
      where('searchKeywords', 'array-contains', term)
    );
    const usersSnapshot = await getDocs(usersQuery);
    results.users = usersSnapshot.docs.map(doc => ({
      uid: doc.id,
      displayName: doc.data().displayName || 'Anonymous',
      specialty: doc.data().specialty || 'No specialty',
      photoURL: doc.data().photoURL || '/images/doctor-avatar.jpeg',
    }));

    console.log('Search term:', term, 'Results:', results);
    return results;
  } catch (error) {
    console.error('searchCasesAndUsers error:', error);
    throw new Error('Failed to search cases and users');
  }
};