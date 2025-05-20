import { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getProfile } from '../firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const profile = await getProfile(currentUser.uid);
          setUser({
            uid: currentUser.uid,
            displayName: currentUser.displayName || profile.displayName || 'User',
            email: currentUser.email || profile.email || '',
            photoURL: profile.photoURL || currentUser.photoURL || '/images/doctor-avatar.jpeg',
            title: profile.title || '',
            education: profile.education || '',
            institution: profile.institution || '',
            specialty: profile.specialty || '',
            bio: profile.bio || '',
            updatedAt: profile.updatedAt || new Date(),
          });
          setError(null);
        } else {
          setUser(null);
          setError(null);
        }
      } catch (err) {
        setError(err.message || 'Failed to load user data');
        setUser(null);
      }
      setLoading(false);
    }, (err) => {
      setError(err.message || 'Authentication error');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};