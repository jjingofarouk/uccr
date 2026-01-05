import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from './config';
import { fetchUserPhotoURL } from './utils';
import { notifyUsersOfCaseChange } from './notifications';

// Using the 'cases' collection but with a caseType for permissions
const COLLECTION_NAME = 'cases';

export const addECG = async (ecgData) => {
    try {
        if (!ecgData.userId) throw new Error('Missing userId in ecgData');

        const validatedData = {
            caseType: 'ecg', // Field to distinguish ECGs from regular cases
            userId: ecgData.userId,
            userName: ecgData.userName || 'Anonymous',
            title: String(ecgData.title || ''),
            clinicalContext: String(ecgData.clinicalContext || ''),
            rate: String(ecgData.rate || ''),
            rhythm: String(ecgData.rhythm || ''),
            axis: String(ecgData.axis || ''),
            pWave: String(ecgData.pWave || ''),
            prInterval: String(ecgData.prInterval || ''),
            qrsComplex: String(ecgData.qrsComplex || ''),
            stSegment: String(ecgData.stSegment || ''),
            tWave: String(ecgData.tWave || ''),
            qtInterval: String(ecgData.qtInterval || ''),
            interpretation: String(ecgData.interpretation || ''),
            teachingPoints: String(ecgData.teachingPoints || ''),
            mediaUrls: Array.isArray(ecgData.mediaUrls) ? ecgData.mediaUrls : [],
            category: String(ecgData.category || 'All'),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            photoURL: String(ecgData.photoURL || ''),
        };

        const docRef = await addDoc(collection(db, COLLECTION_NAME), validatedData);
        await notifyUsersOfCaseChange(docRef.id, validatedData.title, 'Added', validatedData.userId);
        return docRef.id;
    } catch (error) {
        console.error('Error adding ECG:', error);
        throw error;
    }
};

export const getECGs = async () => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('caseType', '==', 'ecg')
        );
        const querySnapshot = await getDocs(q);

        const ecgsPromises = querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const photoURL = data.userId ? await fetchUserPhotoURL(data.userId) : '/images/photo-placeholder.jpg';
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.() || new Date(),
                updatedAt: data.updatedAt?.toDate?.() || new Date(),
                photoURL,
            };
        });

        const ecgs = await Promise.all(ecgsPromises);
        return ecgs.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
        console.error('Error fetching ECGs:', error);
        throw error;
    }
};

export const getECGById = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return null;

        const data = docSnap.data();
        if (data.caseType !== 'ecg') return null; // Ensure it's an ECG

        const photoURL = data.userId ? await fetchUserPhotoURL(data.userId) : '/images/photo-placeholder.jpg';

        return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
            photoURL,
        };
    } catch (error) {
        console.error('Error fetching ECG by ID:', error);
        throw error;
    }
};

export const updateECG = async (id, ecgData) => {
    try {
        const ecgRef = doc(db, COLLECTION_NAME, id);
        const validatedData = {
            ...ecgData,
            updatedAt: serverTimestamp(),
        };
        // Remove fields that shouldn't be updated or are managed by Firebase
        delete validatedData.id;
        delete validatedData.createdAt;

        await updateDoc(ecgRef, validatedData);
        return id;
    } catch (error) {
        console.error('Error updating ECG:', error);
        throw error;
    }
};
