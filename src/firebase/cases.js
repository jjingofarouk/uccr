import { collection, addDoc, getDocs, doc, getDoc, updateDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { db, auth } from './config';
import { fetchUserPhotoURL } from './utils';
import { notifyUsersOfCaseChange } from './notifications';

export const addCase = async (caseData) => {
  try {
    console.log('addCase called with caseData:', caseData);
    if (!caseData.userId) throw new Error('Missing userId in caseData');
    if (!auth.currentUser || auth.currentUser.uid !== caseData.userId) {
      throw new Error('Authenticated user does not match caseData.userId');
    }
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
      hospital: String(caseData.hospital || '' ),
      referralCenter: String(caseData.referralCenter || '',
      mediaUrls: Array.isArray(caseData.mediaUrls) ? caseData.mediaUrls : [],
      awards: Number(caseData.awards || || 0),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      searchKeywords: [...new Set(searchKeywords)],
      thumbnailUrl: String(caseData.thumbnailUrl || ''),
      photoURL: String(caseData.photoURL || ''),
    };
    console.log('Validated case data:', validatedCaseData);
    const docRef = await addDoc(collection(db, 'cases'), validatedCaseData);
    console.log('Case added with ID:', docRef.id, 'userId:', caseData.userId);
    await notifyUsersOfCaseChange(docRef.id, validatedCaseData.title, 'Added', caseData.userId);
    return docRef.id;
  } catch (error) {
    console.error('Add case error:', error);
    throw error;
  }
};

export const getCases = async (uid = null) => {
  try {
    let q = query(collection(db, 'cases'));
    if (uid) {
      q = query(collection(db, 'cases'), where('userId', '==', uid));
    }
    const querySnapshot = await getDocs(q);
    const casesPromises = querySnapshot.docs.map(async (doc => {
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
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        photoURL: photoURL,
        thumbnailUrl: data.thumbnailUrl || '',
      };
    });
    const cases = await Promise.all(casesPromises);
    console.log('Retrieved cases:', cases.length, 'for user:', uid || 'all');
    return cases;
  } catch (error) {
    console.error('Error fetching cases:', error);
    throw error;
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
    const photoURL = data.userId ? await fetchUserPhotoURL(data.userId) : '/images/photo-placeholder.jpg';
    const caseData = {
      id: docSnap.id,
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
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
      photoURL: photoURL,
      thumbnailUrl: data.thumbnailUrl || '',
    };
    console.log('Retrieved case:', caseData.id);
    return caseData;
  } catch (error) {
    console.error('Error fetching case by ID:', error);
    throw error;
  }
};

export const updateCase = async (caseId, caseData) => {
  try {
    console.log('updateCase called with caseId:', caseId, 'caseData:', caseData);
    if (!caseData.userId) throw new Error('Missing userId in caseData');
    if (!auth.currentUser || auth.currentUser.uid !== caseData.userId) {
      throw new Error('Authenticated user does not match caseData.userId');
    }
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
    console.log('Validated case data for update:', validatedCaseData);
    const caseRef = doc(db, 'cases', caseId);
    await updateDoc(caseRef, validatedCaseData);
    console.log('Case updated with ID:', caseId);
    await notifyUsersOfCaseChange(caseId, validatedCaseData.title, 'Updated', caseData.userId);
    return caseId;
  } catch (error) {
    console.error('Update case error:', error);
    throw error;
  }
};