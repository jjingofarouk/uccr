// src/firebase/notifications.js - HIJACKED FOR SUPABASE BRIDGE

export const subscribeToNotifications = (uid, callback) => {
  console.warn('Supabase: Real-time notifications not yet implemented');
  callback([]); // Return empty for now to stop errors
  return () => {}; // Return empty unsubscribe function
};

export const notifyUsersOfCaseChange = async () => {};