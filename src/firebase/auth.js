import { auth } from './config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile as updateAuthProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './config';

export const login = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const signup = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateAuthProfile(userCredential.user, { displayName: name });
};

export const updateProfile = async (user, name, photoUrl) => {
  await updateAuthProfile(user, { displayName: name, photoURL: photoUrl });
};

export const updateUserProfile = async (userId, profileData) => {
  await setDoc(doc(db, 'profiles', userId), profileData, { merge: true });
};