import { createContext, useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { getProfile } from '../lib/supabase/profiles';

export const AuthContext = createContext();

const supabase = createClient();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Instantly check localStorage for cached user
    const cachedUser = localStorage.getItem('uccr_cached_user');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
        setLoading(false); // Can stop loading spinner if we have a cache
      } catch (e) {
        console.warn('Failed to parse cached user');
      }
    }

    const fetchUserData = async (sbUser) => {
      try {
        if (sbUser) {
          let profile = {};
          try {
            profile = await getProfile(sbUser.id);
          } catch (e) {
            console.warn('Profile not found for authenticated user, using defaults.');
          }
          
          const newUser = {
            uid: sbUser.id,
            displayName: profile?.displayName || sbUser.user_metadata?.display_name || sbUser.email?.split('@')[0] || 'Anonymous User',
            email: sbUser.email || profile?.email || '',
            photoURL: profile?.photoURL || '/images/doctor-avatar.jpeg',
            title: profile?.title || '',
            education: profile?.education || '',
            institution: profile?.institution || '',
            specialty: profile?.specialty || '',
            bio: profile?.bio || '',
            role: profile?.role || '',
            updatedAt: profile?.updatedAt || new Date(),
          };

          setUser(newUser);
          localStorage.setItem('uccr_cached_user', JSON.stringify(newUser));
          setError(null);
        } else {
          setUser(null);
          localStorage.removeItem('uccr_cached_user');
          setError(null);
        }
      } catch (err) {
        console.error('AuthContext sync error:', err);
        setError(err.message || 'Failed to load user data');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Initial check
    supabase.auth.getUser().then(({ data: { user } }) => {
      fetchUserData(user);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserData(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    const { data: { user: sbUser } } = await supabase.auth.getUser();
    if (sbUser) {
      setLoading(true);
      try {
        const profile = await getProfile(sbUser.id);
        const refreshedUser = {
          uid: sbUser.id,
          displayName: profile?.displayName || sbUser.user_metadata?.display_name || sbUser.email?.split('@')[0] || 'Anonymous User',
          email: sbUser.email || profile?.email || '',
          photoURL: profile?.photoURL || '/images/doctor-avatar.jpeg',
          title: profile?.title || '',
          education: profile?.education || '',
          institution: profile?.institution || '',
          specialty: profile?.specialty || '',
          bio: profile?.bio || '',
          role: profile?.role || '',
          updatedAt: profile?.updatedAt || new Date(),
        };
        setUser(refreshedUser);
        localStorage.setItem('uccr_cached_user', JSON.stringify(refreshedUser));
      } catch (e) {
        console.warn('Profile refresh error:', e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};