// src/firebase/firestore.js - HIJACKED FOR SUPABASE BRIDGE
import { createClient } from '../utils/supabase/client';
import { addCase, getCases, getCaseById, updateCase, deleteCase } from '../lib/supabase/cases';
import { getProfile, updateProfile, getUsers } from '../lib/supabase/profiles';
import { addECG, getECGs, getECGById, updateECG } from '../lib/supabase/ecgs';
import { searchCasesAndUsers } from '../lib/supabase/search';

const supabase = createClient();

// Map Supabase to the Firebase-style exports the app expects
export const db = supabase;
export const auth = supabase.auth;

export const fetchUserPhotoURL = async (uid) => {
  const profile = await getProfile(uid);
  return profile.photoURL;
};

// Placeholder for yet-to-be-migrated features
export const addComment = async () => console.warn('Supabase: addComment not implemented');
export const getComments = async () => [];
export const sendMessage = async () => {};
export const getMessages = async () => [];
export const addReaction = async () => {};
export const getTrendingCases = async () => getCases(); // Fallback to all cases

// Real-time stats subscription (Fallback for migration)
export const subscribeUserStats = (uid, callback) => {
  // Pass mock values for now to prevent crashes
  setTimeout(() => {
    callback({
      cases: 0,
      comments: 0,
      reactions: 0,
    });
  }, 0);

  // Return a no-op unsubscribe function
  return () => {
    // Subscription cleanup logic would go here
  };
};

export {
  addCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  addECG,
  getECGs,
  getECGById,
  updateECG,
  getProfile,
  updateProfile,
  getUsers,
  searchCasesAndUsers,
};