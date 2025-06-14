import { collection, getDocs } from 'firebase/firestore';
import { db } from './config';

export const getAllSpecialties = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cases'));
    const specialties = [
      ...new Set(
        querySnapshot.docs
          .flatMap((doc) => Array.isArray(doc.data().specialty) ? doc.data().specialty : [])
          .filter(Boolean)
      ),
    ];
    console.log('Fetched specialties:', specialties);
    return specialties;
  } catch (error) {
    console.error('Get specialties error:', error);
    throw new Error('Failed to fetch specialties');
  }
};