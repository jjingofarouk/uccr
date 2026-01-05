// src/firebase/index.js
import { db } from './config';
import { auth } from './auth';
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
import { addECG, getECGs, getECGById, updateECG } from './ecgs';

export {
  db,
  auth,
  fetchUserPhotoURL,
  addCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  addECG,
  getECGs,
  getECGById,
  updateECG,
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