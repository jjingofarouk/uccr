import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { getUsers, getProfile } from './profiles';

export const notifyUsersOfCaseChange = async (caseId, caseTitle, action, userId) => {
  try {
    const users = await getUsers();
    const userProfile = await getProfile(userId);
    const userName = userProfile.displayName || 'Anonymous';
    const notificationPromises = users.map(async (user) => {
      if (!user.uid || user.uid === userId) return;
      const notificationData = {
        userId: user.uid,
        caseId,
        title: `${userName} ${action.toLowerCase()} a case`,
        message: `${userName} has ${action.toLowerCase()} a case: ${caseTitle}. Check it out!`,
        type: 'case_update',
        read: false,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'notifications'), notificationData);
    });
    await Promise.all(notificationPromises);
    console.log(`Notifications sent for case ${action}:`, caseId);
  } catch (error) {
    console.error(`Error sending notifications for case ${action}:`, error);
  }
};