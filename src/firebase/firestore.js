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

// Helper function to fetch photoURL for a user
const fetchUserPhotoURL = async (uid) => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const profileSnap = await getDoc(profileRef);
    const photoURL = profileSnap.exists() ? profileSnap.data().photoURL : null;
    console.log('Fetched photoURL for uid:', uid, 'photoURL:', photoURL); // Debug
    return photoURL || '/images/doctor-avatar.jpeg';
  } catch (error) {
    console.error('Fetch user photoURL error:', error.message);
    return '/images/doctor-avatar.jpeg';
  }
};

export const addCase = async (caseData) => {
  try {
    if (!caseData.uid) {
      throw new Error('Missing uid in caseData');
    }
    const validatedCaseData = {
      userId: caseData.uid, // Ensure userId is uid
      userName: caseData.userName || 'User',
      title: caseData.title || '',
      specialty: caseData.specialty || '',
      presentingComplaint: caseData.presentingComplaint || '',
      history: caseData.history || '',
      investigations: caseData.investigations || '',
      provisionalDiagnosis: caseData.provisionalDiagnosis || '',
      management: caseData.management || '',
      discussion: caseData.discussion || '',
      hospital: caseData.hospital || '',
      referralCenter: caseData.referralCenter || '',
      mediaUrls: Array.isArray(caseData.mediaUrls) ? caseData.mediaUrls : [],
      awards: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'cases'), validatedCaseData);
    console.log('Case added with ID:', docRef.id, 'uid:', caseData.uid); // Debug
    return docRef.id;
  } catch (error) {
    console.error('Add case error:', error.code, error.message);
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to create case' : 'Failed to create case');
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
        userName: data.userName || 'User',
        title: data.title || '',
        specialty: data.specialty || '',
        presentingComplaint: data.presentingComplaint || '',
        history: data.history || '',
        investigations: data.investigations || '',
        provisionalDiagnosis: data.provisionalDiagnosis || '',
        management: data.management || '',
        discussion: data.discussion || '',
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
    console.log('Fetched cases:', cases.length, 'for uid:', uid || 'all'); // Debug
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
      console.warn('Case not found:', id); // Debug
      return null;
    }
    const data = docSnap.data();
    const photoURL = data.userId ? await fetchUserPhotoURL(data.userId) : '/images/doctor-avatar.jpeg';
    const caseData = {
      id: docSnap.id,
      userId: data.userId,
      userName: data.userName || 'User',
      title: data.title || '',
      specialty: data.specialty || '',
      presentingComplaint: data.presentingComplaint || '',
      history: data.history || '',
      investigations: data.investigations || '',
      provisionalDiagnosis: data.provisionalDiagnosis || '',
      management: data.management || '',
      discussion: data.discussion || '',
      hospital: data.hospital || '',
      referralCenter: data.referralCenter || '',
      mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
      awards: Number(data.awards) || 0,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
      photoURL,
    };
    console.log('Fetched case:', caseData.id, 'uid:', caseData.userId); // Debug
    return caseData;
  } catch (error) {
    console.error('Get case by ID error:', error.code, error.message);
    return null;
  }
};

export const addComment = async (caseId, commentData, parentCommentId = null) => {
  try {
    if (!commentData.uid) {
      throw new Error('Missing uid in commentData');
    }
    const comment = {
      userId: commentData.uid, // Ensure userId is uid
      text: commentData.text || '',
      createdAt: serverTimestamp(),
      parentCommentId,
      upvotes: 0,
      downvotes: 0,
    };
    const docRef = await addDoc(collection(db, `cases/${caseId}/comments`), comment);
    console.log('Comment added for case:', caseId, 'ID:', docRef.id, 'uid:', comment.userId); // Debug
    return docRef.id;
  } catch (error) {
    console.error('Add comment error:', error.code, error.message);
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to add comment' : 'Failed to add comment');
  }
};

export const getComments = async (caseId, uid = null) => {
  try {
    let q = query(collection(db, `cases/${caseId}/comments`), orderBy('createdAt', 'asc'));
    if (uid) {
      q = query(collection(db, `cases/${caseId}/comments`), where('userId', '==', uid), orderBy('createdAt', 'asc'));
    }
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      userId: doc.data().userId,
      text: doc.data().text || '',
      parentCommentId: doc.data().parentCommentId || null,
      upvotes: Number(doc.data().upvotes) || 0,
      downvotes: Number(doc.data().downvotes) || 0,
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));
    console.log('Fetched comments for case:', caseId, 'Count:', comments.length, 'uid:', uid || 'all'); // Debug
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
    console.log('Reaction added:', { caseId, uid, type, commentId }); // Debug
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
    console.log('Fetched users:', users.length); // Debug
    return users;
  } catch (error) {
    console.error('Get users error:', error.code, error.message);
    return [];
  }
};

export const sendMessage = async ({ senderId, recipientId, senderName, recipientName, text }) => {
  try {
    // Validate inputs
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

    console.log('sendMessage inputs:', { senderId, recipientId, senderName, recipientName, text }); // Debug

    // Validate recipient exists
    const recipientDoc = await getDoc(doc(db, 'users', recipientId));
    if (!recipientDoc.exists()) {
      throw new Error(`Recipient user ${recipientId} does not exist in users collection`);
    }

    const threadId = [senderId, recipientId].sort().join('_');
    const threadRef = doc(db, 'messages', threadId);

    // Create or update thread document
    const threadData = {
      participants: [senderId, recipientId],
      userNames: {
        [senderId]: senderName?.trim() || auth.currentUser.displayName || 'User',
        [recipientId]: recipientName?.trim() || recipientDoc.data().displayName || 'User',
      },
      lastMessage: text.trim(),
      timestamp: serverTimestamp(),
    };
    console.log('Creating/updating thread:', threadData); // Debug
    await setDoc(threadRef, threadData, { merge: true });

    // Add message to subcollection
    const messageData = {
      senderId,
      text: text.trim(),
      timestamp: serverTimestamp(),
    };
    console.log('Adding message:', messageData); // Debug
    const messageRef = await addDoc(collection(threadRef, 'messages'), messageData);

    console.log('Message sent, thread:', threadId, 'message ID:', messageRef.id);
    return messageRef.id;
  } catch (error) {
    console.error('Send message error:', error.code, error.message, error.stack); // Debug
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
    console.log('Fetched threads for uid:', uid, 'Count:', threads.length); // Debug
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
    console.log('Fetched messages for thread:', threadId, 'Count:', messages.length); // Debug
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
    console.log('Profile fetched for uid:', uid, 'photoURL:', validatedProfile.photoURL); // Debug
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
    console.log('Profile updated for uid:', uid, 'photoURL:', validatedProfileData.photoURL); // Debug
  } catch (error) {
    console.error('Update profile error:', error.code, error.message);
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to update profile' : 'Failed to update profile');
  }
};

export const getUserStats = async (uid) => {
  try {
    // Fetch cases
    const cases = await getCases(uid);
    const caseCount = cases.length;

    // Fetch comments using collection group query
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

    console.log('Fetched user stats for uid:', uid, { cases: caseCount, comments: commentCount, reactions: reactionCount }); // Debug
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