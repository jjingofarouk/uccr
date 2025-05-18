import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth: AuthContext is undefined. Ensure useAuth is called within AuthProvider.');
  }
  return context;
};