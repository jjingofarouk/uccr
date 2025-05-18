import { auth, db } from './config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile as updateAuthProfile, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', email);
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Failed to log in');
  }
};

export const signup = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User created:', user.uid, email);

    // Update Firebase Auth profile
    await updateAuthProfile(user, { displayName: name });
    console.log('Auth profile updated with displayName:', name);

    // Create users document for inbox search
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      displayName: name,
      email,
      createdAt: new Date().toISOString(),
    }, { merge: true });
    console.log('Users document created for:', user.uid);

    // Create profiles document
    await setDoc(doc(db, 'profiles', user.uid), {
      displayName: name,
      email,
    }, { merge: true });
    console.log('Profiles document created for:', user.uid);

    return user;
  } catch (error) {
    console.error('Signup error:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
};

export const updateProfile = async (user, name, photoUrl) => {
  try {
    await updateAuthProfile(user, { displayName: name, photoURL: photoUrl });
    console.log('Auth profile updated for:', user.uid);
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, 'profiles', userId), profileData, { merge: true });
    console.log('User profile updated for:', userId);
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error('Firebase signOut error:', error);
    throw new Error('Unable to sign out');
  }
};