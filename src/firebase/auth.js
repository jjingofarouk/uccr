import { auth, db } from './config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile as updateAuthProfile, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const login = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const signup = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await updateAuthProfile(user, { displayName: name });
  // Create users document for inbox search
  await setDoc(doc(db, 'users', user.uid), {
    displayName: name,
    email,
    uid: user.uid,
    createdAt: new Date().toISOString(),
  }, { merge: true });
  // Create profiles document (as before)
  await setDoc(doc(db, 'profiles', user.uid), {
    displayName: name,
    email,
  }, { merge: true });
};

export const updateProfile = async (user, name, photoUrl) => {
  await updateAuthProfile(user, { displayName: name, photoURL: photoUrl });
};

export const updateUserProfile = async (userId, profileData) => {
  await setDoc(doc(db, 'profiles', userId), profileData, { merge: true });
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Firebase signOut error:', error);
    throw new Error('Unable to sign out');
  }
};