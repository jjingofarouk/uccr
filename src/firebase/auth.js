import { auth } from './config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile as updateAuthProfile, 
  signOut 
} from 'firebase/auth';

export const login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    console.log('User logged in:', userCredential.user.uid, email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Login error:', {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message || 'Failed to log in' };
  }
};

export const signup = async (email, password, name) => {
  try {
    if (!email || !password || !name) {
      throw new Error('Email, password, and name are required');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;
    console.log('User created:', user.uid, email);

    // Update Firebase Auth profile
    await updateAuthProfile(user, { displayName: name.trim() });
    console.log('Auth profile updated with displayName:', name);

    return { success: true, user };
  } catch (error) {
    console.error('Signup error:', {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message || 'Failed to sign up' };
  }
};

export const updateAuthProfile = async (user, { displayName, photoURL }) => {
  try {
    if (!user) {
      throw new Error('No authenticated user provided');
    }
    const updateData = {};
    if (displayName) updateData.displayName = displayName.trim();
    if (photoURL) updateData.photoURL = photoURL;
    await updateAuthProfile(user, updateData);
    console.log('Auth profile updated for:', user.uid, updateData);
    return { success: true };
  } catch (error) {
    console.error('Update auth profile error:', {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message || 'Failed to update profile' };
  }
};

export const logout = async (retryCount = 2) => {
  try {
    if (!auth) {
      console.error('Firebase auth not initialized');
      return { success: false, error: 'Authentication service unavailable' };
    }
    await signOut(auth);
    console.log('User signed out successfully');
    return { success: true };
  } catch (error) {
    console.error('Firebase signOut error:', {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    if (retryCount > 0 && error.code === 'network-request-failed') {
      console.log(`Retrying logout, attempts remaining: ${retryCount}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
      return logout(retryCount - 1);
    }
    return { success: false, error: error.message || 'Unable to sign out' };
  }
};