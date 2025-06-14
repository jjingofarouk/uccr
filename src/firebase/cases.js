import { collection, addDoc, getDocs, doc, getDoc, updateDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { db, auth } from './config';
import { fetchUserPhotoURL } from './utils';

export const addCase = async (caseData) => {
  try {
    console.log('addCase called with caseData:', caseData);
    if (!caseData.userId) throw new Error('Missing userId in caseData');
    if (!auth.currentUser || auth.currentUser.uid !== caseData.userId) {
      throw new Error('Authenticated user does not match caseData.userId');
    }
    const validatedCaseData = {
      userId: caseData.userId,
      userName: caseData.userName || 'Anonymous',
      title: String(caseData.title || ''),
      specialty: Array.isArray(caseData.specialty) ? caseData.specialty : [],
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
    let q;
    if (uid) {
      q = query(collection(db, 'cases'), where('userId', '==', uid));
    } else {
      q = query(collection(db, 'cases'));
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
      specialty: Array.isArray(data.specialty) ? data.specialty : (data.specialty ? [data.specialty] : []),
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

export const updateCase = async (caseId, caseData) => {
  try {
    console.log('updateCase called with caseId:', caseId, 'caseData:', caseData);
    if (!caseData.userId) throw new Error('Missing userId in caseData');
    if (!auth.currentUser || auth.currentUser.uid !== caseData.userId) {
      throw new Error('Authenticated user does not match caseData.userId');
    }
    const validatedCaseData = {
      userId: caseData.userId,
      userName: caseData.userName || 'Anonymous',
      title: String(caseData.title || ''),
      specialty: Array.isArray(caseData.specialty) ? caseData.specialty : [],
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
      awards: Number(caseData.awards) || 0,
      updatedAt: serverTimestamp(),
    };
    console.log('Validated case data for update:', validatedCaseData);
    const caseRef = doc(db, 'cases', caseId);
    await updateDoc(caseRef, validatedCaseData);
    console.log('Case updated with ID:', caseId, 'userId:', caseData.userId);
    return caseId;
  } catch (error) {
    console.error('Update case error:', { code: error.code, message: error.message, stack: error.stack });
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to update case' : `Failed to update case: ${error.message}`);
  }
};