import { collection, getDocs } from 'firebase/firestore';
import { db } from './config';

export const getAllSpecialties = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cases'));
    const specialties = new Set();

    querySnapshot.docs.forEach((doc) => {
      const { specialty } = doc.data();
      if (Array.isArray(specialty)) {
        specialty.forEach((spec) => {
          if (spec && typeof spec === 'string') {
            // Split combined specialties in arrays (e.g., "Tropical Medicine and Infectious Diseases")
            spec.split(/and|,|\s+/).forEach((s) => {
              const trimmed = s.trim();
              if (trimmed) specialties.add(trimmed);
            });
          }
        });
      } else if (typeof specialty === 'string' && specialty) {
        // Split combined specialties in strings (e.g., "Tropical Medicine and Infectious Diseases")
        specialty.split(/and|,|\s+/).forEach((s) => {
          const trimmed = s.trim();
          if (trimmed) specialties.add(trimmed);
        });
      }
    });

    const result = [...specialties];
    console.log('Fetched specialties:', result);
    return result;
  } catch (error) {
    console.error('Get specialties error:', error);
    throw new Error('Failed to fetch specialties');
  }
};