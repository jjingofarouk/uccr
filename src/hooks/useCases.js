import { useState, useEffect } from 'react';
import { getCases, getCaseById } from '../firebase/firestore';

export const useCases = (uid = null) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedCases = await getCases(uid);
        const processedCases = fetchedCases.map((caseData) => ({
          ...caseData,
          specialty: Array.isArray(caseData.specialty) ? caseData.specialty : (caseData.specialty ? [caseData.specialty] : []),
          createdAt: caseData.createdAt instanceof Date ? caseData.createdAt : new Date(caseData.createdAt || Date.now()),
        }));
        console.log('Processed cases with specialties:', processedCases.map(c => ({ id: c.id, specialty: c.specialty })));
        setCases(processedCases);
      } catch (error) {
        console.error('Error fetching cases:', error);
        setError('Failed to load cases');
        setCases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [uid]);

  return { cases, getCaseById, loading, error };
};