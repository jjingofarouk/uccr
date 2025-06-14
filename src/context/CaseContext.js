// src/context/CaseContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { getCases } from '../firebase/firestore';

const CaseContext = createContext();

export function CaseProvider({ children }) {
  const [cases, setCases] = useState(() => {
    // Load cached cases from localStorage
    const cachedCases = localStorage.getItem('cases');
    return cachedCases ? JSON.parse(cachedCases) : [];
  });
  const [loading, setLoading] = useState(!localStorage.getItem('cases')); // Set loading based on cached data
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const fetchedCases = await getCases();
        setCases(fetchedCases);
        // Persist fetched cases to localStorage
        localStorage.setItem('cases', JSON.stringify(fetchedCases));
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