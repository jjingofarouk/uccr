import { storage } from './config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from './config';

export const uploadImage = async (file, path = `cases/${auth.currentUser.uid}/${Date.now()}`) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};
