import { db } from './config';
import { collection, addDoc, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

export const addCase = async (caseData) => {
  console.log('addCase: Received caseData', caseData);
  await addDoc(collection(db, 'cases'), caseData);
};

export const getCases = async () => {
  const querySnapshot = await getDocs(collection(db, 'cases'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getCaseById = async (id) => {
  const docRef = doc(db, 'cases', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const addComment = async (caseId, comment) => {
  await addDoc(collection(db, `cases/${caseId}/comments`), comment);
};

export const getComments = async (caseId) => {
  const querySnapshot = await getDocs(collection(db, `cases/${caseId}/comments`));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addReaction = async (caseId, userId, type) => {
  await setDoc(doc(db, `cases/${caseId}/reactions`, userId), { type });
};

export const sendMessage = async (threadId, senderId, text) => {
  await addDoc(collection(db, `messages/${threadId}/messages`), {
    senderId,
    text,
    createdAt: new Date(),
  });
};

export const getMessages = async (userId) => {
  const querySnapshot = await getDocs(collection(db, 'messages'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};