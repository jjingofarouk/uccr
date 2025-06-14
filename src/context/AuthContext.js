import { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getProfile } from '../firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Default to null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async (currentUser) => {
      try {
        let userData = null;

        if (typeof window !== 'undefined' && localStorage.getItem('authUser')) {
          // Load user from cache if available
          userData = JSON.parse(localStorage.getItem('authUser'));
        } 
        
        if (!userData && currentUser) {
          // Fetch profile data if not cached
          const profile = await getProfile(currentUser.uid);
          userData = {
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

          if (typeof window !== 'undefined') {
            localStorage.setItem('authUser', JSON.stringify(userData)); // Cache user data
          }
        }

        setUser(userData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load user data');
        setUser(null);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchUser(currentUser);
      } else {
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authUser'); // Clear cache when user logs out
        }
        setError(null);
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