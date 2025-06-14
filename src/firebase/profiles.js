import { collection, doc, getDoc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export const getProfile = async (uid) => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const profileSnap = await getDoc(profileRef);
    const profileData = profileSnap.exists() ? profileSnap.data() : {};
    const validatedProfile = {
      uid,
      role: profileData.role || '',
      photoURL: profileData.photoURL || '/images/doctor-avatar.jpeg',
      displayName: profileData.displayName || 'User',
      email: profileData.email || '',
      title: profileData.title || '',
      education: profileData.education || '',
      institution: profileData.institution || '',
      specialty: profileData.specialty || '',
      bio: profileData.bio || '',
      linkedIn: profileData.linkedIn || '',
      xProfile: profileData.xProfile || '',
      researchInterests: Array.isArray(profileData.researchInterests) ? profileData.researchInterests : [],
      certifications: Array.isArray(profileData.certifications) ? profileData.certifications : [],
      yearsOfExperience: profileData.yearsOfExperience || '',
      professionalAffiliations: Array.isArray(profileData.professionalAffiliations)
        ? profileData.professionalAffiliations
        : [],
      levelOfStudy: profileData.levelOfStudy || '',
      courseOfStudy: profileData.courseOfStudy || '',
      updatedAt: profileData.updatedAt?.toDate?.() || new Date(),
    };
    console.log('Profile fetched for uid:', uid, 'photoURL:', validatedProfile.photoURL);
    return validatedProfile;
  } catch (error) {
    console.error('Get profile error:', error.code, error.message);
    return {
      uid,
      role: '',
      photoURL: '/images/doctor-avatar.jpeg',
      displayName: 'User',
      email: '',
      title: '',
      education: '',
      institution: '',
      specialty: '',
      bio: '',
      linkedIn: '',
      xProfile: '',
      researchInterests: [],
      certifications: [],
      yearsOfExperience: '',
      professionalAffiliations: [],
      levelOfStudy: '',
      courseOfStudy: '',
      updatedAt: new Date(),
    };
  }
};

export const updateProfile = async (uid, profileData) => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const validatedProfileData = {
      role: profileData.role || '',
      displayName: profileData.displayName || 'User',
      email: profileData.email || '',
      photoURL: profileData.photoURL || '/images/doctor-avatar.jpeg',
      title: profileData.title || '',
      education: profileData.education || '',
      institution: profileData.institution || '',
      specialty: profileData.specialty || '',
      bio: profileData.bio || '',
      linkedIn: profileData.linkedIn || '',
      xProfile: profileData.xProfile || '',
      researchInterests: Array.isArray(profileData.researchInterests) ? profileData.researchInterests : [],
      certifications: Array.isArray(profileData.certifications) ? profileData.certifications : [],
      yearsOfExperience: profileData.yearsOfExperience || '',
      professionalAffiliations: Array.isArray(profileData.professionalAffiliations)
        ? profileData.professionalAffiliations
        : [],
      levelOfStudy: profileData.levelOfStudy || '',
      courseOfStudy: profileData.courseOfStudy || '',
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

export const getUsers = async () => {
  try {
    const profilesSnapshot = await getDocs(collection(db, 'profiles'));
    const users = profilesSnapshot.docs.map(doc => ({
      uid: doc.id,
      role: doc.data().role || '',
      displayName: doc.data().displayName || 'User',
      email: doc.data().email || '',
      photoURL: doc.data().photoURL || '/images/doctor-avatar.jpeg',
      levelOfStudy: doc.data().levelOfStudy || '',
      courseOfStudy: doc.data().courseOfStudy || '',
    }));
    console.log('Fetched users:', users.length);
    return users;
  } catch (error) {
    console.error('Get users error:', error.code, error.message);
    return [];
  }
};