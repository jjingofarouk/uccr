// context/AuthContext.jsx
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
      if (currentUser) {
        const profile = await getProfile(currentUser.uid);
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName || 'User',
          email: currentUser.email || '',
          photoURL: profile?.photoURL || currentUser.photoURL || '/images/doctor-avatar.jpeg',
          ...profile,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    }, (err) => {
      setError(err.message);
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