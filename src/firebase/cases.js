import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { auth, db } from './config';
import { fetchUserPhotoURL } from './utils';
import { notifyUsersOfCaseChange } from './notifications';

export const addCase = async (caseData) => {
  try {
    console.log('addCase called with caseData:', { userId: caseData.userId, title: caseData.title });
    if (!caseData.userId) throw new Error('Missing userId in caseData');
    if (!auth.currentUser || auth.currentUser.uid !== caseData.userId) {
      throw new Error('Authenticated user does not match caseData.userId');
    }
    // Force refresh authentication token
    await auth.currentUser.getIdToken(true);
    console.log('Authentication token refreshed for user:', caseData.userId);
    const searchKeywords = [
      ...(caseData.title?.toLowerCase().split(/\s+/) || []),
      ...(Array.isArray(caseData.specialty) ? caseData.specialty.map(s => s.toLowerCase()) : [caseData.specialty?.toLowerCase()]),
      ...(caseData.presentingComplaint?.toLowerCase().split(/\s+/) || []),
    ].filter(Boolean);

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
      awards: Number(caseData.awards || 0),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      searchKeywords: [...new Set(searchKeywords)],
      thumbnailUrl: String(caseData.thumbnailUrl || ''),
      photoURL: String(caseData.photoURL || ''),
    };
    console.log('Validated case data:', { id: validatedCaseData.userId, title: validatedCaseData.title });
    const docRef = await addDoc(collection(db, 'cases'), validatedCaseData);
    console.log('Case added successfully with ID:', docRef.id);
    await notifyUsersOfCaseChange(docRef.id, validatedCaseData.title, 'Added', caseData.userId);
    return docRef.id;
  } catch (error) {
    console.error('Add case error:', { message: error.message, code: error.code, userId: caseData.userId });
    throw error;
  }
};

export const updateCase = async (caseId, caseData) => {
  try {
    console.log('updateCase called with caseId:', caseId, 'caseData:', { userId: caseData.userId, title: caseData.title });
    if (!caseId) throw new Error('Missing caseId');
    if (!caseData.userId) throw new Error('Missing userId in caseData');
    if (!auth.currentUser || auth.currentUser.uid !== caseData.userId) {
      throw new Error('Authenticated user does not match caseData.userId');
    }
    // Force refresh authentication token
    await auth.currentUser.getIdToken(true);
    console.log('Authentication token refreshed for user:', caseData.userId);
    const searchKeywords = [
      ...(caseData.title?.toLowerCase().split(/\s+/) || []),
      ...(Array.isArray(caseData.specialty) ? caseData.specialty.map(s => s.toLowerCase()) : []),
      ...(caseData.presentingComplaint?.toLowerCase().split(/\s+/) || []),
    ].filter(Boolean);

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
      awards: Number(caseData.awards || 0),
      updatedAt: serverTimestamp(),
      searchKeywords: [...new Set(searchKeywords)],
      thumbnailUrl: String(caseData.thumbnailUrl || ''),
      photoURL: String(caseData.photoURL || ''),
    };
    console.log('Validated case data for update:', { id: caseId, title: validatedCaseData.title });
    const caseRef = doc(db, 'cases', caseId);
    await updateDoc(caseRef, validatedCaseData);
    console.log('Case updated successfully with ID:', caseId);
    await notifyUsersOfCaseChange(caseId, validatedCaseData.title, 'Updated', caseData.userId);
    return caseId;
  } catch (error) {
    console.error('Update case error:', { message: error.message, code: error.code, caseId, userId: caseData.userId });
    throw error;
  }
};

export const getCaseById = async (caseId) => {
  try {
    console.log('getCaseById called with caseId:', caseId);
    const caseRef = doc(db, 'cases', caseId);
    const caseSnap = await getDoc(caseRef);
    if (!caseSnap.exists()) {
      console.log('Case not found:', caseId);
      return null;
    }
    const data = caseSnap.data();
    console.log('Case retrieved:', { id: caseId, title: data.title });
    return { id: caseSnap.id, ...data };
  } catch (error) {
    console.error('Get case error:', { message: error.message, code: error.code, caseId });
    throw error;
  }
};

export const getCases = async (uid = null) => {
  try {
    console.log('getCases called with uid:', uid);
    let q = query(collection(db, 'cases'));
    if (uid) {
      q = query(collection(db, 'cases'), where('userId', '==', uid));
    }
    const querySnapshot = await getDocs(q);
    const casesPromises = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const photoURL = data.userId ? await fetchUserPhotoURL(data.userId) : '/images/photo-placeholder.jpg';
      return {
        id: doc.id,
        userId: data.userId || '',
        userName: data.userName || 'Anonymous',
        title: data.title || '',
        specialty: Array.isArray(data.specialty) ? data.specialty : [],
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
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
        searchKeywords: Array.isArray(data.searchKeywords) ? data.searchKeywords : [],
        thumbnailUrl: data.thumbnailUrl || '',
        photoURL: data.photoURL || photoURL,
      };
    });
    const cases = await Promise.all(casesPromises);
    console.log('Cases retrieved:', cases.length);
    return cases;
  } catch (error) {
    console.error('Get cases error:', { message: error.message, code: error.code, uid });
    throw error;
  }
};

export const deleteCase = async (caseId) => {
  try {
    console.log('deleteCase called with caseId:', caseId);
    if (!auth.currentUser) throw new Error('User not authenticated');
    await auth.currentUser.getIdToken(true);
    console.log('Authentication token refreshed for user:', auth.currentUser.uid);
    const caseRef = doc(db, 'cases', caseId);
    await deleteDoc(caseRef);
    console.log('Case deleted successfully with ID:', caseId);
    await notifyUsersOfCaseChange(caseId, '', 'Deleted', auth.currentUser.uid);
  } catch (error) {
    console.error('Delete case error:', { message: error.message, code: error.code, caseId });
    throw error;
  }
};