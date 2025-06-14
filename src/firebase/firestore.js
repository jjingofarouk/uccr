import { db, auth } from './config';
import { fetchUserPhotoURL } from './utils';
import { addCase, getCases, getCaseById, updateCase } from './cases';
import { addComment, getComments } from './comments';
import { getProfile, updateProfile, updateUserProfile, getUsers } from './profiles';
import { sendMessage, getMessages, getThreadMessages } from './messages';
import { addReaction } from './reactions';
import { getUserStats, subscribeUserStats, getCaseStatistics } from './stats';
import { getTopContributors } from './contributors';
import { getTrendingCases } from './trending'; // New import
import { searchCasesAndUsers } from './search';
import { getAllSpecialties } from './specialties';

export {
  db,
  auth,
  fetchUserPhotoURL,
  addCase,
  getCases,
  getCaseById,
  updateCase,
  addComment,
  getComments,
  getProfile,
  updateProfile,
  updateUserProfile,
  getUsers,
  sendMessage,
  getMessages,
  getThreadMessages,
  addReaction,
  getUserStats,
  subscribeUserStats,
  getCaseStatistics,
  getTopContributors,
  getTrendingCases, // New export
  searchCasesAndUsers,
  getAllSpecialties,
};