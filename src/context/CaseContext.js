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

        // Fetch cases directly from Firebase
        const fetchedCases = await getCases();
        setCases(fetchedCases);
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