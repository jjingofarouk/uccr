import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { getUsers } from './profiles';

export const notifyUsersOfCaseChange = async (caseId, caseTitle, action) => {
  try {
    const users = await getUsers();
    const notificationPromises = users.map(async (user) => {
      if (!user.uid) return;
      const notificationData = {
        userId: user.uid,
        caseId,
        title: `Case ${action}: ${caseTitle}`,
        message: `A case has been ${action.toLowerCase()}: ${caseTitle}`,
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