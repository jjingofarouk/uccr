import { doc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

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