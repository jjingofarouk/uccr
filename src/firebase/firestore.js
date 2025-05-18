import { db } from './config';
import { collection, addDoc, getDocs, doc, getDoc, setDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

export const addCase = async (caseData) => {
  try {
    const caseWithTimestamp = {
      ...caseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'pending', // For moderation
      viewCount: 0,
      commentCount: 0,
    };
    console.log('addCase: Submitting caseData', caseWithTimestamp);
    const docRef = await addDoc(collection(db, 'cases'), caseWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('addCase: Error adding case', error);
    throw new Error('Failed to add case: ' + error.message);
  }
};

export const getCases = async (filters = {}) => {
  try {
    let q = collection(db, 'cases');
    if (filters.specialty) {
      q = query(q, where('specialty', '==', filters.specialty));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    q = query(q, where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('getCases: Error fetching cases', error);
    throw new Error('Failed to fetch cases: ' + error.message);
  }
};

export const getCaseById = async (id) => {
  try {
    const docRef = doc(db, 'cases', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    await setDoc(docRef, { viewCount: (docSnap.data().viewCount || 0) + 1 }, { merge: true });
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('getCaseById: Error fetching case', error);
    throw new Error('Failed to fetch case: ' + error.message);
  }
};

export const addComment = async (caseId, comment) => {
  try {
    const commentWithTimestamp = {
      ...comment,
      createdAt: serverTimestamp(),
      isApproved: false, // For moderation
    };
    const docRef = await addDoc(collection(db, `cases/${caseId}/comments`), commentWithTimestamp);
    await setDoc(doc(db, 'cases', caseId), { 
      commentCount: increment(1),
      updatedAt: serverTimestamp()
    }, { merge: true });
    return docRef.id;
  } catch (error) {
    console.error('addComment: Error adding comment', error);
    throw new Error('Failed to add comment: ' + error.message);
  }
};

export const getComments = async (caseId) => {
  try {
    const q = query(
      collection(db, `cases/${caseId}/comments`),
      where('isApproved', '==', true),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('getComments: Error fetching comments', error);
    throw new Error('Failed to fetch comments: ' + error.message);
  }
};

export const addReaction = async (caseId, userId, type) => {
  try {
    const validReactions = ['like', 'helpful', 'question'];
    if (!validReactions.includes(type)) {
      throw new Error('Invalid reaction type');
    }
    await setDoc(doc(db, `cases/${caseId}/reactions`, userId), { 
      type,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('addReaction: Error adding reaction', error);
    throw new Error('Failed to add reaction: ' + error.message);
  }
};

export const getReactions = async (caseId) => {
  try {
    const querySnapshot = await getDocs(collection(db, `cases/${caseId}/reactions`));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('getReactions: Error fetching reactions', error);
    throw new Error('Failed to fetch reactions: ' + error.message);
  }
};

export const sendMessage = async (threadId, senderId, text) => {
  try {
    const message = {
      senderId,
      text,
      createdAt: serverTimestamp(),
      isRead: false,
    };
    const docRef = await addDoc(collection(db, `messages/${threadId}/messages`), message);
    await setDoc(doc(db, 'messages', threadId), {
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    return docRef.id;
  } catch (error) {
    console.error('sendMessage: Error sending message', error);
    throw new Error('Failed to send message: ' + error.message);
  }
};

export const getMessages = async (threadId) => {
  try {
    const q = query(
      collection(db, `messages/${threadId}/messages`),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('getMessages: Error fetching messages', error);
    throw new Error('Failed to fetch messages: ' + error.message);
  }
};

export const getSpecialties = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'specialties'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('getSpecialties: Error fetching specialties', error);
    throw new Error('Failed to fetch specialties: ' + error.message);
  }
};

export const moderateCase = async (caseId, status, moderatorId) => {
  try {
    await setDoc(doc(db, 'cases', caseId), {
      status,
      moderatedBy: moderatorId,
      moderatedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('moderateCase: Error moderating case', error);
    throw new Error('Failed to moderate case: ' + error.message);
  }
};

export const moderateComment = async (caseId, commentId, isApproved, moderatorId) => {
  try {
    await setDoc(doc(db, `cases/${caseId}/comments`, commentId), {
      isApproved,
      moderatedBy: moderatorId,
      moderatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('moderateComment: Error moderating comment', error);
    throw new Error('Failed to moderate comment: ' + error.message);
  }
};