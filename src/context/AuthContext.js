import { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('AuthProvider: Setting up onAuthStateChanged');
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('AuthProvider: onAuthStateChanged fired', {
        currentUser: currentUser ? { uid: currentUser.uid, displayName: currentUser.displayName } : null,
      });
      setUser(currentUser);
      setLoading(false);
    }, (err) => {
      console.error('AuthProvider: onAuthStateChanged error', err);
      setError(err.message);
      setLoading(false);
    });
    return () => {
      console.log('AuthProvider: Cleaning up onAuthStateChanged');
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};