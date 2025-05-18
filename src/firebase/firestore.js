import { db } from './config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

// Add a case
export const addCase = async (caseData) => {
  console.log('addCase: Received caseData', caseData);
  await addDoc(collection(db, 'cases'), caseData);
};

// Get all cases
export const getCases = async () => {
  const querySnapshot = await getDocs(collection(db, 'cases'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get a case by ID
export const getCaseById = async (id) => {
  const docRef = doc(db, 'cases', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Add a comment to a case
export const addComment = async (caseId, comment) => {
  await addDoc(collection(db, `cases/${caseId}/comments`), comment);
};

// Get comments for a case
export const getComments = async (caseId) => {
  const querySnapshot = await getDocs(collection(db, `cases/${caseId}/comments`));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add a reaction to a case
export const addReaction = async (caseId, userId, type) => {
  await setDoc(doc(db, `cases/${caseId}/reactions`, userId), { type });
};

// Fetch all users
export const getUsers = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => ({
      uid: doc.id,
      displayName: doc.data().displayName || 'User',
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Send a message
export const sendMessage = async ({ senderId, recipientId, senderName, recipientName, text }) => {
  try {
    const threadId = [senderId, recipientId].sort().join('_');
    const threadRef = doc(db, 'messages', threadId);

    await addDoc(collection(threadRef, 'messages'), {
      senderId,
      text,
      timestamp: serverTimestamp(),
    });

    await setDoc(threadRef, {
      participants: [senderId, recipientId],
      userNames: {
        [senderId]: senderName,
        [recipientId]: recipientName,
      },
      lastMessage: text,
      timestamp: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get message threads for a user
export const getMessages = async (userId) => {
  try {
    const threads = [];
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', userId),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
      const data = doc.data();
      const otherUserId = data.participants.find(id => id !== userId);
      threads.push({
        id: doc.id,
        otherUserName: data.userNames[otherUserId] || 'User',
        lastMessage: data.lastMessage || '',
      });
    });
    return threads;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

// Get messages for a specific thread
export const getThreadMessages = async (threadId) => {
  try {
    const q = query(
      collection(db, `messages/${threadId}/messages`),
      orderBy('timestamp', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching thread messages:', error);
    return [];
  }
};