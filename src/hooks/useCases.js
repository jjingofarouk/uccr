import { useState, useEffect, useRef } from 'react';
import { getCases, getCaseById } from '../firebase/firestore';

// In-memory cache
const casesCache = {};

export const useCases = (uid = null) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const cacheKey = useRef(uid);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);

      // Check if cached data exists
      if (casesCache[cacheKey.current]) {
        setCases(casesCache[cacheKey.current]);
        setLoading(false);
        return;
      }

      try {
        const fetchedCases = await getCases(uid);
        setCases(fetchedCases);

        // Cache the fetched data
        casesCache[cacheKey.current] = fetchedCases;
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