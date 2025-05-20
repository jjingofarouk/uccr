// src/firebase/firestore.js
import { db, auth } from './config';
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
  increment,
  collectionGroup,
} from 'firebase/firestore';

const fetchUserPhotoURL = async (uid) => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const profileSnap = await getDoc(profileRef);
    const photoURL = profileSnap.exists() ? profileSnap.data().photoURL : null;
    return photoURL || '/images/doctor-avatar.jpeg';
  } catch (error) {
    console.error('Fetch user photoURL error:', error.message);
    return '/images/doctor-avatar.jpeg';
  }
};

export const addCase = async (caseData) => {
  try {
    console.log('addCase called with caseData:', caseData);
    if (!caseData.userId) {
      throw new Error('Missing userId in caseData');
    }
    if (!auth.currentUser || auth.currentUser.uid !== caseData.userId) {
      throw new Error('Authenticated user does not match caseData.userId');
    }
    const validatedCaseData = {
      userId: caseData.userId,
      userName: caseData.userName || 'Anonymous',
      title: String(caseData.title || ''),
      specialty: String(caseData.specialty || ''),
      presentingComplaint: String(caseData.presentingComplaint || ''),
      history: String(caseData.history || ''),
      physicalExam: String(caseData.physicalExam || ''),
      investigations: String(caseData.investigations || ''),
      provisionalDiagnosis: String(caseData.provisionalDiagnosis || ''),
      management: String(caseData.management || ''),
      discussion: String(caseData.discussion || ''),
      highLevelSummary: String(caseData.highLevelSummary || ''),
      references: String(caseData.references || ''),
      hospital: String(caseData.hospital || ''),
      referralCenter: String(caseData.referralCenter || ''),
      mediaUrls: Array.isArray(caseData.mediaUrls) ? caseData.mediaUrls : [],
      awards: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    console.log('Validated case data:', validatedCaseData);
    const docRef = await addDoc(collection(db, 'cases'), validatedCaseData);
    console.log('Case added with ID:', docRef.id, 'userId:', caseData.userId);
    return docRef.id;
  } catch (error) {
    console.error('Add case error:', { code: error.code, message: error.message, stack: error.stack });
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to create case' : `Failed to create case: ${error.message}`);
  }
};

export const getCases = async (uid = null) => {
  try {
    let q = collection(db, 'cases');
    if (uid) {
      q = query(collection(db, 'cases'), where('userId', '==', uid));
    }
    const querySnapshot = await getDocs(q);
    const casesPromises = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const photoURL = data.userId ? await fetchUserPhotoURL(data.userId) : '/images/doctor-avatar.jpeg';
      return {
        id: doc.id,
        userId: data.userId,
        userName: data.userName || 'Anonymous',
        title: data.title || '',
        specialty: data.specialty || '',
        presentingComplaint: data.presentingComplaint || '',
        history: data.history || '',
        physicalExam: data.physicalExam || '',
        investigations: data.investigations || '',
        provisionalDiagnosis: data.provisionalDiagnosis || '',
        management: data.management || '',
        discussion: data.discussion || '',
        highLevelSummary: data.highLevelSummary || '',
        references: data.references || '',
        hospital: data.hospital || '',
        referralCenter: data.referralCenter || '',
        mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
        awards: Number(data.awards) || 0,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        photoURL,
      };
    });
    const cases = await Promise.all(casesPromises);
    console.log('Fetched cases:', cases.length, 'for uid:', uid || 'all');
    return cases;
  } catch (error) {
    console.error('Get cases error:', error.code, error.message);
    return [];
  }
};

export const getCaseById = async (id) => {
  try {
    const docRef = doc(db, 'cases', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.warn('Case not found:', id);
      return null;
    }
    const data = docSnap.data();
    const photoURL = data.userId ? await fetchUserPhotoURL(data.userId) : '/images/doctor-avatar.jpeg';
    const caseData = {
      id: docSnap.id,
      userId: data.userId,
      userName: data.userName || 'Anonymous',
      title: data.title || '',
      specialty: data.specialty || '',
      presentingComplaint: data.presentingComplaint || '',
      history: data.history || '',
      physicalExam: data.physicalExam || '',
      investigations: data.investigations || '',
      provisionalDiagnosis: data.provisionalDiagnosis || '',
      management: data.management || '',
      discussion: data.discussion || '',
      highLevelSummary: data.highLevelSummary || '',
      references: data.references || '',
      hospital: data.hospital || '',
      referralCenter: data.referralCenter || '',
      mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
      awards: Number(data.awards) || 0,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
      photoURL,
    };
    console.log('Fetched case:', caseData.id, 'uid:', caseData.userId);
    return caseData;
  } catch (error) {
    console.error('Get case by ID error:', error.code, error.message);
    return null;
  }
};

export const addComment = async (caseId, commentData, parentCommentId = null) => {
  try {
    if (!commentData.userId) {
      throw new Error('Missing userId in commentData');
    }
    if (!auth.currentUser || auth.currentUser.uid !== commentData.userId) {
      throw new Error('Authenticated user does not match commentData.userId');
    }
    const comment = {
      userId: commentData.userId,
      text: commentData.text || '',
      createdAt: serverTimestamp(),
      parentCommentId,
      upvotes: 0,
      downvotes: 0,
    };
    const docRef = await addDoc(collection(db, `cases/${caseId}/comments`), comment);
    console.log('Comment added for case:', caseId, 'ID:', docRef.id, 'uid:', comment.userId);
    return docRef.id;
  } catch (error) {
    console.error('Add comment error:', error.code, error.message, error.stack);
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to add comment' : `Failed to add comment: ${error.message}`);
  }
};

export const getComments = async (caseId, uid = null) => {
  try {
    let q = query(collection(db, `cases/${caseId}/comments`), orderBy('createdAt', 'asc'));
    if (uid) {
      q = query(collection(db, `cases/${caseId}/comments`), where('userId', '==', uid), orderBy('createdAt', 'asc'));
    }
    const querySnapshot = await getDocs(q);
    const commentsPromises = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const photoURL = data.userId ? await fetchUserPhotoURL(data.userId) : '/images/doctor-avatar.jpeg';
      const profile = data.userId ? await getProfile(data.userId) : { displayName: 'Anonymous' };
      return {
        id: doc.id,
        userId: data.userId,
        userName: profile.displayName || 'Anonymous',
        userPhoto: photoURL,
        text: data.text || '',
        parentCommentId: data.parentCommentId || null,
        upvotes: Number(data.upvotes) || 0,
        downvotes: Number(data.downvotes) || 0,
        createdAt: data.createdAt?.toDate?.() || new Date(),
      };
    });
    const comments = await Promise.all(commentsPromises);
    console.log('Fetched comments for case:', caseId, 'Count:', comments.length, 'uid:', uid || 'all');
    return comments;
  } catch (error) {
    console.error('Get comments error:', error.code, error.message);
    return [];
  }
};

export const addReaction = async (caseId, uid, type, commentId = null) => {
  try {
    const isCaseReaction = !commentId;
    const reactionPath = isCaseReaction
      ? `cases/${caseId}/reactions/${uid}`
      : `cases/${caseId}/comments/${commentId}/reactions/${uid}`;

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
    console.log('Reaction added:', { caseId, uid, type, commentId });
  } catch (error) {
    console.error('Add reaction error:', error.code, error.message);
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to add reaction' : 'Failed to add reaction');
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
    console.log('Fetched users:', users.length);
    return users;
  } catch (error) {
    console.error('Get users error:', error.code, error.message);
    return [];
  }
};

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

export const getProfile = async (uid) => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const profileSnap = await getDoc(profileRef);
    const profileData = profileSnap.exists() ? profileSnap.data() : {};
    const validatedProfile = {
      uid,
      photoURL: profileData.photoURL || '/images/doctor-avatar.jpeg',
      displayName: profileData.displayName || 'User',
      email: profileData.email || '',
      title: profileData.title || '',
      education: profileData.education || '',
      institution: profileData.institution || '',
      specialty: profileData.specialty || '',
      bio: profileData.bio || '',
      updatedAt: profileData.updatedAt?.toDate?.() || new Date(),
    };
    console.log('Profile fetched for uid:', uid, 'photoURL:', validatedProfile.photoURL);
    return validatedProfile;
  } catch (error) {
    console.error('Get profile error:', error.code, error.message);
    return {
      uid,
      photoURL: '/images/doctor-avatar.jpeg',
      displayName: 'User',
      email: '',
      title: '',
      education: '',
      institution: '',
      specialty: '',
      bio: '',
      updatedAt: new Date(),
    };
  }
};

export const updateProfile = async (uid, profileData) => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const validatedProfileData = {
      displayName: profileData.displayName || 'User',
      email: profileData.email || '',
      photoURL: profileData.photoURL || '/images/doctor-avatar.jpeg',
      title: profileData.title || '',
      education: profileData.education || '',
      institution: profileData.institution || '',
      specialty: profileData.specialty || '',
      bio: profileData.bio || '',
      updatedAt: serverTimestamp(),
    };
    await setDoc(profileRef, validatedProfileData, { merge: true });
    console.log('Profile updated for uid:', uid, 'photoURL:', validatedProfileData.photoURL);
  } catch (error) {
    console.error('Update profile error:', error.code, error.message);
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to update profile' : 'Failed to update profile');
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, 'profiles', userId), profileData, { merge: true });
    console.log('User profile updated for:', userId);
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

export const getUserStats = async (uid) => {
  try {
    const cases = await getCases(uid);
    const caseCount = cases.length;

    const commentsQuery = query(
      collectionGroup(db, 'comments'),
      where('userId', '==', uid)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    const commentCount = commentsSnapshot.size;
    let reactionCount = 0;
    commentsSnapshot.forEach(doc => {
      const comment = doc.data();
      reactionCount += (Number(comment.upvotes) || 0) + (Number(comment.downvotes) || 0);
    });

    console.log('Fetched user stats for uid:', uid, { cases: caseCount, comments: commentCount, reactions: reactionCount });
    return {
      cases: caseCount,
      comments: commentCount,
      reactions: reactionCount,
    };
  } catch (error) {
    console.error('Get user stats error:', error.code, error.message);
    return { cases: 0, comments: 0, reactions: 0 };
  }
};