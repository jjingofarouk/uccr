// src/context/CaseContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { getCases } from '../firebase/firestore';

const CaseContext = createContext();

export function CaseProvider({ children }) {
  // Initialize cases with an empty array
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);

        // Check if localStorage is accessible (client-side only)
        let cachedCases = [];
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem('cases');
          if (cached) {
            cachedCases = JSON.parse(cached);
            setCases(cachedCases); // Load cases from cache
          }
        }

        // Fetch cases from Firebase if cache is empty
        if (cachedCases.length === 0) {
          const fetchedCases = await getCases();
          setCases(fetchedCases);

          // Persist fetched cases to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('cases', JSON.stringify(fetchedCases));
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch cases');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return (
    <CaseContext.Provider value={{ cases, setCases, loading, error }}>
      {children}
    </CaseContext.Provider>
  );
}

export function useCases() {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCases must be used within a CaseProvider');
  }
  return context;
}