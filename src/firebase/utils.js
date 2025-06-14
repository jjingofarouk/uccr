import { doc, getDoc } from 'firebase/firestore';
import { db } from './config';

export const fetchUserPhotoURL = async (uid) => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const profileSnap = await getDoc(profileRef);
    const photoURL = profileSnap.exists() ? profileSnap.data().photoURL : null;
    return photoURL || '/images/doctor-avatar.jpeg';
  } catch (error) {
    console.error('Fetch user photoURL error:', error.message);
    return '/images/doctor-avatar.jpeg';
  }
};