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
    console.log('addCase: Received caseData', caseData);
    const docRef = await addDoc(collection(db, 'cases'), {
      ...caseData,
      createdAt: serverTimestamp(),
    });
    console.log('Case added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding case:', error);
    throw error;
  }
};

export const getCases = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cases'));
    const cases = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Fetched cases:', cases);
    return cases;
  } catch (error) {
    console.error('Error fetching cases:', error);
    return [];
  }
};

export const getCaseById = async (id) => {
  try {
    const docRef = doc(db, 'cases', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const caseData = { id: docSnap.id, ...docSnap.data() };
      console.log('Fetched case:', caseData);
      return caseData;
    }
    console.log('Case not found:', id);
    return null;
  } catch (error) {
    console.error('Error fetching case:', error);
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
    console.log('Comment added to case', caseId, ':', commentData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
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
    const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Fetched comments for case', caseId, ':', comments);
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const addReaction = async (caseId, userId, type) => {
  try {
    await setDoc(doc(db, `cases/${caseId}/reactions`, userId), { type, timestamp: serverTimestamp() });
    console.log('Reaction added to case', caseId, 'by user', userId, ':', type);
  } catch (error) {
    console.error('Error adding reaction:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map(doc => ({
      uid: doc.id,
      displayName: doc.data().displayName || 'User',
      email: doc.data().email || '',
    }));
    console.log('Fetched users:', users);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const sendMessage = async ({ senderId, recipientId, senderName, recipientName, text }) => {
  try {
    if (!senderId || !recipientId || !text?.trim()) {
      throw new Error('Missing required fields: senderId, recipientId, or text');
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
    console.log('Message sent in thread', threadId, ':', messageData);

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
    console.log('Thread updated:', threadId, threadData);

    return messageRef.id;
  } catch (error) {
    console.error('Error sending message:', {
      message: error.message,
      code: error.code,
      details: error.details
    });
    throw new Error(error.code === 'permission-denied' ? 'Missing or insufficient permissions' : error.message || 'Failed to send message');
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
    console.log('Fetched threads for user', userId, ':', threads);
    return threads;
  } catch (error) {
    console.error('Error fetching messages:', error);
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
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('Fetched messages for thread', threadId, ':', messages);
    return messages;
  } catch (error) {
    console.error('Error fetching thread messages:', error);
    return [];
  }
};