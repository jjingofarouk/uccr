import { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getProfile } from '../firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage if available
    const cachedUser = localStorage.getItem('authUser');
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  const [loading, setLoading] = useState(!localStorage.getItem('authUser')); // Set loading based on cached user
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // Check if user data is already cached
          if (!localStorage.getItem('authUser')) {
            const profile = await getProfile(currentUser.uid);
            const userData = {
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
            };

            setUser(userData);
            localStorage.setItem('authUser', JSON.stringify(userData)); // Cache user data
          } else {
            setUser(JSON.parse(localStorage.getItem('authUser'))); // Load from cache
          }
          setError(null);
        } else {
          setUser(null);
          localStorage.removeItem('authUser'); // Clear cache when user logs out
          setError(null);
        }
      } catch (err) {
        setError(err.message || 'Failed to load user data');
        setUser(null);
      }
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