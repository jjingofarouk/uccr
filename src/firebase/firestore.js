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
import { onSnapshot } from 'firebase/firestore';

const fetchUserPhotoURL = async (uid) => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const profileSnap = await getDoc(profileRef);
    const photoURL = profileSnap.exists() ? profileSnap.data().photoURL : null;
    return photoURL || '/images/doctor-avatar.jpeg';
  } catch (error) {
    return '/images/doctor-avatar.jpeg';
  }
};

export const addCase = async (caseData) => {
  try {
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
      specialty: Array.isArray(caseData.specialty) ? caseData.specialty : (caseData.specialty ? [caseData.specialty] : []),
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
    const docRef = await addDoc(collection(db, 'cases'), validatedCaseData);
    return docRef.id;
  } catch (error) {
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to create case' : `Failed to create case: ${error.message}`);
  }
};

export const getCases = async (uid = null) => {
  try {
    const casesRef = collection(db, 'cases');
    const queryConstraints = uid ? [where('userId', '==', uid)] : [];
    const querySnapshot = await getDocs(query(casesRef, ...queryConstraints));
    const cases = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const userDoc = await getDoc(doc(db, 'profiles', data.userId));
      const photoURL = userDoc.exists() ? userDoc.data().photoURL || '/images/doctor-avatar.jpeg' : '/images/doctor-avatar.jpeg';
      return {
        id: doc.id,
        userId: data.userId || '',
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
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        photoURL,
      };
    }));
    return cases;
  } catch (error) {
    throw new Error('Failed to fetch cases');
  }
};

export const getCaseById = async (id) => {
  try {
    const docRef = doc(db, 'cases', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    const data = docSnap.data();
    const userDoc = await getDoc(doc(db, 'profiles', data.userId));
    const photoURL = userDoc.exists() ? userDoc.data().photoURL || '/images/doctor-avatar.jpeg' : '/images/doctor-avatar.jpeg';
    return {
      id: docSnap.id,
      userId: data.userId || '',
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
      mediaUrls: Array.isArray(data.mediaUrls) ? data.data.mediaUrls : [],
      awards: Number(data.awards) || 0,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      photoURL,
    };
  } catch (error) {
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
    return docRef.id;
  } catch (error) {
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
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });
    const comments = await Promise.all(commentsPromises);
    return comments;
  } catch (error) {
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
  } catch (error) {
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to add reaction' : 'Failed to add reaction');
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
    return users;
  } catch (error) {
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

    const recipientDoc = await getDoc(doc(db, 'profiles', recipientId));
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
    await setDoc(threadRef, threadData, { merge: true });

    const messageData = {
      senderId,
      text: text.trim(),
      timestamp: serverTimestamp(),
    };
    const messageRef = await addDoc(collection(threadRef, 'messages'), messageData);

    return messageRef.id;
  } catch (error) {
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
        timestamp: data.timestamp?.toDate() || new Date(),
      });
    });
    return threads;
  } catch (error) {
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
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    }));
    return messages;
  } catch (error) {
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
      updatedAt: profileData.updatedAt?.toDate() || new Date(),
    };
    return validatedProfile;
  } catch (error) {
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
  } catch (error) {
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to update profile' : 'Failed to update profile');
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, 'profiles', userId), profileData, { merge: true });
  } catch (error) {
    throw error;
  }
};

export const getUserStats = async (uid) => {
  try {
    const casesQuery = query(collection(db, 'cases'), where('userId', '==', uid));
    const casesSnapshot = await getDocs(casesQuery);
    const caseCount = casesSnapshot.size;

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

    return {
      cases: caseCount,
      comments: commentCount,
      reactions: reactionCount,
    };
  } catch (error) {
    return { cases: 0, comments: 0, reactions: 0 };
  }
};

export const subscribeUserStats = (uid, callback) => {
  try {
    const casesQuery = query(collection(db, 'cases'), where('userId', '==', uid));
    const commentsQuery = query(collectionGroup(db, 'comments'), where('userId', '==', uid));

    const unsubscribeCases = onSnapshot(casesQuery, (casesSnapshot) => {
      const caseCount = casesSnapshot.size;
      let reactionCount = 0;

      const unsubscribeComments = onSnapshot(commentsQuery, (commentsSnapshot) => {
        const commentCount = commentsSnapshot.size;
        commentsSnapshot.forEach(doc => {
          const comment = doc.data();
          reactionCount += (Number(comment.upvotes) || 0) + (Number(comment.downvotes) || 0);
        });

        const stats = {
          cases: caseCount,
          comments: commentCount,
          reactions: reactionCount,
        };
        callback(stats);
      }, (error) => {
        callback({ cases: caseCount, comments: 0, reactions: 0 });
      });

      return () => unsubscribeComments();
    }, (error) => {
      callback({ cases: 0, comments: 0, reactions: 0 });
    });

    return () => unsubscribeCases();
  } catch (error) {
    callback({ cases: 0, comments: 0, reactions: 0 });
    return () => {};
  }
};

export const updateCase = async (caseId, caseData) => {
  try {
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
      specialty: Array.isArray(caseData.specialty) ? caseData.specialty : (caseData.specialty ? [caseData.specialty] : []),
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
    const caseRef = doc(db, 'cases', caseId);
    await updateDoc(caseRef, validatedCaseData);
    return caseId;
  } catch (error) {
    throw new Error(error.code === 'permission-denied' ? 'Missing permissions to update case' : `Failed to update case: ${error.message}`);
  }
};

export const getTopContributors = async (limitCount = 3) => {
  try {
    const profilesRef = collection(db, 'profiles');
    const profilesSnapshot = await getDocs(profilesRef);
    const contributors = [];

    for (const profileDoc of profilesSnapshot.docs) {
      const profileData = profileDoc.data();
      const casesRef = collection(db, 'cases');
      const userCasesQuery = query(casesRef, where('userId', '==', profileDoc.id));
      const casesSnapshot = await getDocs(userCasesQuery);
      const caseCount = casesSnapshot.size;
      
      let totalAwards = 0;
      casesSnapshot.forEach(doc => {
        const caseData = doc.data();
        totalAwards += Number(caseData.awards) || 0;
      });

      const awards = [];
      if (totalAwards >= 5) {
        awards.push('Gold');
      } else if (totalAwards >= 3) {
        awards.push('Silver');
      } else if (totalAwards >= 1) {
        awards.push('Bronze');
      }

      if (caseCount > 0) {
        contributors.push({
          uid: profileDoc.id,
          displayName: profileData.displayName || 'Anonymous',
          photoURL: profileData.photoURL || '/images/doctor-avatar.jpeg',
          caseCount,
          awards,
        });
      }
    }

    return contributors
      .sort((a, b) => b.caseCount - a.caseCount)
      .slice(0, limitCount);
  } catch (error) {
    return [];
  }
};

export const getCaseStatistics = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cases'));
    const specialtyCounts = {};
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const specialties = Array.isArray(data.specialty) ? data.specialty : (data.specialty ? [data.specialty] : []);
      specialties.forEach((specialty) => {
        if (specialty) {
          specialtyCounts[specialty] = (specialtyCounts[specialty] || 0) + 1;
        }
      });
    });
    const stats = Object.entries(specialtyCounts).map(([specialty, count]) => ({
      specialty,
      count,
    }));
    return stats;
  } catch (error) {
    throw new Error('Failed to fetch case statistics');
  }
};

export const searchCasesAndUsers = async (searchTerm) => {
  try {
    const term = searchTerm.toLowerCase().trim();
    const results = { cases: [], users: [] };

    const casesRef = collection(db, 'cases');
    const casesSnapshot = await getDocs(casesRef);
    const casePromises = casesSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const matches =
        (data.title?.toLowerCase().includes(term) ||
         (Array.isArray(data.specialty) ? data.specialty.some(s => s.toLowerCase().includes(term)) : data.specialty?.toLowerCase().includes(term)) ||
         data.presentingComplaint?.toLowerCase().includes(term) ||
         data.highLevelSummary?.toLowerCase().includes(term));
      if (matches) {
        return {
          id: doc.id,
          title: data.title || 'Untitled Case',
          specialty: Array.isArray(data.specialty) ? data.specialty : (data.specialty ? [data.specialty] : []),
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      }
      return null;
    });
    results.cases = (await Promise.all(casePromises)).filter((c) => c !== null);

    const usersRef = collection(db, 'profiles');
    const usersSnapshot = await getDocs(usersRef);
    const userPromises = usersSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const matches =
        (data.displayName?.toLowerCase().includes(term) ||
         data.specialty?.toLowerCase().includes(term) ||
         data.email?.toLowerCase().includes(term));
      if (matches) {
        return {
          uid: doc.id,
          displayName: data.displayName || 'Anonymous',
          specialty: data.specialty || 'No specialty',
          photoURL: data.photoURL || '/images/doctor-avatar.jpeg',
        };
      }
      return null;
    });
    results.users = (await Promise.all(userPromises)).filter((u) => u !== null);

    return results;
  } catch (error) {
    throw new Error('Failed to search cases and users');
  }
};

export const getAllSpecialties = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cases'));
    const specialties = [
      ...new Set(
        querySnapshot.docs
          .flatMap((doc) => {
            const data = doc.data();
            return Array.isArray(data.specialty) ? data.specialty : (data.specialty ? [data.specialty] : []);
          })
          .filter(Boolean)
      ),
    ];
    return specialties;
  } catch (error) {
    return [];
  }
};