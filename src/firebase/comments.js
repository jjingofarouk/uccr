import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './config';
import { getProfile } from './profiles';

export const addComment = async (caseId, commentData, parentCommentId = null) => {
  try {
    if (!commentData.userId) throw new Error('Missing userId in commentData');
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
    let q = uid
      ? query(collection(db, `cases/${caseId}/comments`), where('userId', '==', uid), orderBy('createdAt', 'asc'))
      : query(collection(db, `cases/${caseId}/comments`), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    const commentsPromises = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const profile = data.userId ? await getProfile(data.userId) : { displayName: 'Anonymous', photoURL: '/images/doctor-avatar.jpeg' };
      return {
        id: doc.id,
        userId: data.userId,
        userName: profile.displayName || 'Anonymous',
        userPhoto: profile.photoURL || '/images/doctor-avatar.jpeg',
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