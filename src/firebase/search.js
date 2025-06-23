// src/firebase/search.js
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from './config';

export const searchCasesAndUsers = async (searchTerm) => {
  try {
    const term = searchTerm.toLowerCase().trim();
    if (term.length < 2) return { cases: [], users: [] };

    const results = { cases: [], users: [] };

    // Fetch all cases and profiles
    const casesQuery = query(collection(db, 'cases'));
    const usersQuery = query(collection(db, 'profiles'));
    const [casesSnapshot, usersSnapshot] = await Promise.all([
      getDocs(casesQuery),
      getDocs(usersQuery),
    ]);

    // Filter cases by all fields
    results.cases = casesSnapshot.docs
      .filter(doc => {
        const data = doc.data();
        return Object.values(data).some(value => {
          if (Array.isArray(value)) {
            return value.some(item =>
              typeof item === 'string' && item.toLowerCase().includes(term)
            );
          }
          return typeof value === 'string' && value.toLowerCase().includes(term);
        });
      })
      .map(doc => ({
        id: doc.id,
        title: doc.data().title || 'Untitled Case',
        specialty: Array.isArray(doc.data().specialty)
          ? doc.data().specialty.join(', ')
          : doc.data().specialty || 'No specialty',
        userId: doc.data().userId,
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));

    // Filter users by all fields
    results.users = usersSnapshot.docs
      .filter(doc => {
        const data = doc.data();
        return Object.values(data).some(value => {
          if (Array.isArray(value)) {
            return value.some(item =>
              typeof item === 'string' && item.toLowerCase().includes(term)
            );
          }
          return typeof value === 'string' && value.toLowerCase().includes(term);
        });
      })
      .map(doc => ({
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