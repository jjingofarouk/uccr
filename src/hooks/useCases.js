import { useState, useEffect } from 'react';
import { getCases, getCaseById } from '../firebase/firestore';

export const useCases = (uid = null) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const fetchedCases = await getCases(uid);
        setCases(fetchedCases);
      } catch (error) {
        console.error('Error fetching cases:', error);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [uid]);

  return { cases, getCaseById, loading };
};