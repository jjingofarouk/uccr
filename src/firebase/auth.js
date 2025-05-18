import { auth } from './config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile as updateFirebaseProfile } from 'firebase/auth';

export const login = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const signup = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateFirebaseProfile(userCredential.user, { displayName: name });
};

export const logout = async () => {
  await signOut(auth);
};

export const updateProfile = async (user, name, photoURL) => {
  await updateFirebaseProfile(user, { displayName: name, photoURL });
};
