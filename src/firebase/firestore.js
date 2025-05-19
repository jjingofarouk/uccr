// firebase/firestore.js
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
  orderBy,
  updateDoc,
  increment
} from 'firebase/firestore';

export const addCase = async (caseData) => {
  try {
    // Validate mediaUrls
    const validatedCaseData = {
      ...caseData,
      mediaUrls: Array.isArray(caseData.mediaUrls) ? caseData.mediaUrls : [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      awards: 0,
    };
    const docRef = await addDoc(collection(db, 'cases'), validatedCaseData);
    console.log('Case added with ID:', docRef.id, 'mediaUrls:', validatedCaseData.mediaUrls); // Debug
    return docRef.id;
  } catch (error) {
    console.error('Add case error:', error);
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to create case' : 'Failed to create case');
  }
};

export const getCases = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cases'));
    const cases = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const mediaUrls = Array.isArray(data.mediaUrls) ? data.mediaUrls : [];
      console.log('Case ID:', doc.id, 'mediaUrls:', mediaUrls); // Debug
      return {
        id: doc.id,
        ...data,
        mediaUrls,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
      };
    });
    return cases;
  } catch (error) {
    console.error('Get cases error:', error);
    return [];
  }
};

export const getCaseById = async (id) => {
  try {
    const docRef = doc(db, 'cases', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.warn('Case not found:', id); // Debug
      return null;
    }
    const data = docSnap.data();
    const mediaUrls = Array.isArray(data.mediaUrls) ? data.mediaUrls : [];
    console.log('Case ID:', docSnap.id, 'mediaUrls:', mediaUrls); // Debug
    return {
      id: docSnap.id,
      ...data,
      mediaUrls,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
    };
  } catch (error) {
    console.error('Get case by ID error:', error);
    return null;
  }
};

export const addComment = async (caseId, commentData, parentCommentId = null) => {
  try {
    const comment = {
      ...commentData,
      createdAt: serverTimestamp(),
      parentCommentId: parentCommentId,
      upvotes: 0,
      downvotes: 0,
    };
    const docRef = await addDoc(collection(db, `cases/${caseId}/comments`), comment);
    console.log('Comment added for case:', caseId, 'ID:', docRef.id); // Debug
    return docRef.id;
  } catch (error) {
    console.error('Add comment error:', error);
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
    const comments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
    }));
    console.log('Comments for case:', caseId, 'Count:', comments.length); // Debug
    return comments;
  } catch (error) {
    console.error('Get comments error:', error);
    return [];
  }
};

export const addReaction = async (caseId, userId, type, commentId = null) => {
  try {
    const isCaseReaction = !commentId;
    const reactionPath = isCaseReaction 
      ? `cases/${caseId}/reactions/${userId}`
      : `cases/${caseId}/comments/${commentId}/reactions/${userId}`;
    
    await setDoc(doc(db, reactionPath), {
      type,
      timestamp: serverTimestamp(),
    });

    if (isCaseReaction) {
      const caseRef = doc(db, 'cases', caseId);
      await updateDoc(caseRef, {
        awards: increment(type === 'award' ? 1 : 0),
      });
    } else {
      const commentRef = doc(db, `cases/${caseId}/comments`, commentId);
      await updateDoc(commentRef, {
        upvotes: increment(type === 'upvote' ? 1 : 0),
        downvotes: increment(type === 'downvote' ? 1 : 0),
      });
    }
    console.log('Reaction added:', { caseId, userId, type, commentId }); // Debug
  } catch (error) {
    console.error('Add reaction error:', error);
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
      photoURL: doc.data().photoURL || '/images/doctor-avatar.jpeg',
    }));
    console.log('Fetched users:', users.length); // Debug
    return users;
  } catch (error) {
    console.error('Get users error:', error);
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
    console.log('Message sent, thread:', threadId, 'message ID:', messageRef.id); // Debug
    return messageRef.id;
  } catch (error) {
    console.error('Send message error:', error);
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
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
      });
    });
    console.log('Fetched threads for user:', userId, 'Count:', threads.length); // Debug
    return threads;
  } catch (error) {
    console.error('Get messages error:', error);
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
      timestamp: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate() : new Date(),
    }));
    console.log('Fetched messages for thread:', threadId, 'Count:', messages.length); // Debug
    return messages;
  } catch (error) {
    console.error('Get thread messages error:', error);
    return [];
  }
};

export const getProfile = async (userId) => {
  try {
    const profileRef = doc(db, 'profiles', userId);
    const profileSnap = await getDoc(profileRef);
    const profileData = profileSnap.exists() ? profileSnap.data() : {};
    const validatedProfile = {
      ...profileData,
      photoURL: profileData.photoURL || '/images/doctor-avatar.jpeg',
      displayName: profileData.displayName || 'User',
      title: profileData.title || '',
      education: profileData.education || '',
      institution: profileData.institution || '',
      specialty: profileData.specialty || '',
      bio: profileData.bio || '',
    };
    console.log('Profile fetched for user:', userId, 'photoURL:', validatedProfile.photoURL); // Debug
    return validatedProfile;
  } catch (error) {
    console.error('Get profile error:', error);
    return {
      photoURL: '/images/doctor-avatar.jpeg',
      displayName: 'User',
      title: '',
      education: '',
      institution: '',
      specialty: '',
      bio: '',
    };
  }
};

export const updateProfile = async (userId, profileData) => {
  try {
    const profileRef = doc(db, 'profiles', userId);
    const validatedProfileData = {
      ...profileData,
      photoURL: profileData.photoURL || '/images/doctor-avatar.jpeg',
      updatedAt: serverTimestamp(),
    };
    await setDoc(profileRef, validatedProfileData, { merge: true });
    console.log('Profile updated for user:', userId, 'photoURL:', validatedProfileData.photoURL); // Debug
  } catch (error) {
    console.error('Update profile error:', error);
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to update profile' : 'Failed to update profile');
  }
};