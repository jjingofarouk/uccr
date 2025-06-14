import { collection, addDoc, getDocs, doc, getDoc, setDoc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from './config';

export const sendMessage = async ({ senderId, recipientId, senderName, recipientName, text }) => {
  try {
    if (!senderId || !recipientId || !text?.trim()) {
      throw new Error('Missing required fields: senderId, recipientId, and text are required');
    }
    if (senderId === recipientId) {
      throw new Error('Cannot send message to self');
    }
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    if (senderId !== auth.currentUser.uid) {
      throw new Error('senderId does not match authenticated user');
    }

    console.log('sendMessage inputs:', { senderId, recipientId, senderName, recipientName, text });

    const recipientDoc = await getDoc(doc(db, 'users', recipientId));
    if (!recipientDoc.exists()) {
      throw new Error(`Recipient user ${recipientId} does not exist in users collection`);
    }

    const threadId = [senderId, recipientId].sort().join('_');
    const threadRef = doc(db, 'messages', threadId);

    const threadData = {
      participants: [senderId, recipientId],
      userNames: {
        [senderId]: senderName?.trim() || auth.currentUser.displayName || 'User',
        [recipientId]: recipientName?.trim() || recipientDoc.data().displayName || 'User',
      },
      lastMessage: text.trim(),
      timestamp: serverTimestamp(),
    };
    console.log('Creating/updating thread:', threadData);
    await setDoc(threadRef, threadData, { merge: true });

    const messageData = {
      senderId,
      text: text.trim(),
      timestamp: serverTimestamp(),
    };
    console.log('Adding message:', messageData);
    const messageRef = await addDoc(collection(threadRef, 'messages'), messageData);

    console.log('Message sent, thread:', threadId, 'message ID:', messageRef.id);
    return messageRef.id;
  } catch (error) {
    console.error('Send message error:', error.code, error.message, error.stack);
    throw new Error(
      error.code === 'permission-denied'
        ? 'Permission denied: Check authentication and user IDs'
        : error.message || 'Failed to send message'
    );
  }
};

export const getMessages = async (uid) => {
  try {
    const threads = [];
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', uid),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
      const data = doc.data();
      const otherUserId = data.participants.find(id => id !== uid);
      threads.push({
        id: doc.id,
        otherUserName: data.userNames[otherUserId] || 'User',
        lastMessage: data.lastMessage || '',
        timestamp: data.timestamp?.toDate?.() || new Date(),
      });
    });
    console.log('Fetched threads for uid:', uid, 'Count:', threads.length);
    return threads;
  } catch (error) {
    console.error('Get messages error:', error.code, error.message);
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
      senderId: doc.data().senderId,
      text: doc.data().text || '',
      timestamp: doc.data().timestamp?.toDate?.() || new Date(),
    }));
    console.log('Fetched messages for thread:', threadId, 'Count:', messages.length);
    return messages;
  } catch (error) {
    console.error('Get thread messages error:', error.code, error.message);
    return [];
  }
};