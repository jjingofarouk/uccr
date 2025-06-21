import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './config';
import { getUsers, getProfile } from './profiles';

export const notifyUsersOfCaseChange = async (caseId, caseTitle, action, userId) => {
  try {
    // Fetch all users except the one who triggered the action
    const users = await getUsers();
    const userProfile = await getProfile(userId);
    const userName = userProfile.displayName || 'Anonymous';
    
    // Create notification for each user
    const notificationPromises = users
      .filter(user => user.uid !== userId && user.uid) // Exclude the triggering user
      .map(async (user) => {
        const notificationData = {
          userId: user.uid,
          caseId,
          title: `New case activity by ${userName}`,
          message: `${userName} has ${action.toLowerCase()} the case "${caseTitle}".`,
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
    throw error;
  }
};

// Subscribe to notifications for a specific user
export const subscribeToNotifications = (userId, callback) => {
  if (!userId) return () => {};

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));
    callback(notifications);
  }, (error) => {
    console.error('Error subscribing to notifications:', error);
  });
};