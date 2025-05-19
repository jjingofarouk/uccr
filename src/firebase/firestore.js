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

export const addCase = async (caseData) => {
  try {
    const docRef = await addDoc(collection(db, 'cases'), {
      ...caseData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to create case' : 'Failed to create case');
  }
};

export const getCases = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cases'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return [];
  }
};

export const getCaseById = async (id) => {
  try {
    const docRef = doc(db, 'cases', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    return null;
  }
};

export const addComment = async (caseId, comment) => {
  try {
    const commentData = {
      ...comment,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, `cases/${caseId}/comments`), commentData);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getComments = async (caseId) => {
  try {
    const q = query(
      collection(db, `cases/${caseId}/comments`),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return [];
  }
};

export const addReaction = async (caseId, userId, type) => {
  try {
    await setDoc(doc(db, `cases/${caseId}/reactions`, userId), { type, timestamp: serverTimestamp() });
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => ({
      uid: doc.id,
      displayName: doc.data().displayName || 'User',
      email: doc.data().email || '',
    }));
  } catch (error) {
    return [];
  }
};

export const sendMessage = async ({ senderId, recipientId, senderName, recipientName, text }) => {
  try {
    if (!senderId || !recipientId || !text?.trim()) {
      throw new Error('Missing required fields');
    }
    if (senderId === recipientId) {
      throw new Error('Cannot send message to self');
    }
    const threadId = [senderId, recipientId].sort().join('_');
    const threadRef = doc(db, 'messages', threadId);

    const messageData = {
      senderId,
      text: text.trim(),
      timestamp: serverTimestamp(),
    };
    const messageRef = await addDoc(collection(threadRef, 'messages'), messageData);

    const threadData = {
      participants: [senderId, recipientId],
      userNames: {
        [senderId]: senderName || 'User',
        [recipientId]: recipientName || 'User',
      },
      lastMessage: text.trim(),
      timestamp: serverTimestamp(),
    };
    await setDoc(threadRef, threadData, { merge: true });

    return messageRef.id;
  } catch (error) {
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to send message' : error.message || 'Failed to send message');
  }
};

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
        timestamp: data.timestamp,
      });
    });
    return threads;
  } catch (error) {
    return [];
  }
};

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
    return [];
  }
};

export const getProfile = async (userId) => {
  try {
    const profileRef = doc(db, 'profiles', userId);
    const profileSnap = await getDoc(profileRef);
    return profileSnap.exists() ? profileSnap.data() : null;
  } catch (error) {
    return null;
  }
};