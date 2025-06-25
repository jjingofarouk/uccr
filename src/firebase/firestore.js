import { db, auth } from './config';
import { fetchUserPhotoURL } from './utils';
import { addCase, getCases, getCaseById, updateCase, deleteCase } from './cases';
import { addComment, getComments } from './comments';
import { getProfile, updateProfile, updateUserProfile, getUsers } from './profiles';
import { sendMessage, getMessages, getThreadMessages } from './messages';
import { addReaction } from './reactions';
import { getUserStats, subscribeUserStats, getCaseStatistics } from './stats';
import { getTopContributors } from './contributors';
import { getTrendingCases } from './trending';
import { searchCasesAndUsers } from './search';
import { getAllSpecialties } from './specialties';
import { notifyUsersOfCaseChange } from './notifications';

export {
  db,
  auth,
  fetchUserPhotoURL,
  addCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
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
  getTrendingCases,
  searchCasesAndUsers,
  getAllSpecialties,
  notifyUsersOfCaseChange,
};